import { afterAll, describe, expect, it } from "vitest";
import { asAnon, asService, asUser, confirmUser, createUser, email, pool, TEST_DATABASE_URL, uniq } from "./helpers";

/**
 * Regras de acesso no banco (Postgres local + stub do Supabase).
 * Rode com: bash tests/db/run-migrations.sh && TEST_DATABASE_URL=... npx vitest run tests/db
 */
describe.skipIf(!TEST_DATABASE_URL)("memberships (Cakto → acesso)", () => {
  const p = pool();
  afterAll(() => p.end());

  const buy = async (mail: string, kind: "main" | "love", order: string) =>
    (await asService(p, "select public.cakto_apply_purchase($1, $2, $3) as r", [mail, kind, order])).rows[0].r;
  const revoke = async (order: string, mail: string | null, reason = "refunded") =>
    (await asService(p, "select public.cakto_apply_revocation($1, $2, $3) as r", [order, mail, reason])).rows[0].r;
  const row = async (mail: string) =>
    (await p.query("select * from public.memberships where email = $1", [mail.toLowerCase()])).rows[0];
  const access = async (uid: string) =>
    (await asUser(p, uid, "select * from public.my_access()")).rows[0] as { active: boolean; love: boolean };

  it("compra antes do cadastro fica pendente de usuário; conta não confirmada não recebe acesso", async () => {
    const m = email("pre");
    expect(await buy(m, "main", uniq("o"))).toBe("applied_user_pending");
    const uid = await createUser(p, m, false);
    expect((await row(m)).user_id).toBeNull();
    expect(await access(uid)).toEqual({ active: false, love: false });
    await confirmUser(p, uid);
    expect((await row(m)).user_id).toBe(uid);
    expect(await access(uid)).toEqual({ active: true, love: false });
  });

  it("conta já confirmada é ligada na hora; webhook repetido não duplica", async () => {
    const m = email("now");
    const uid = await createUser(p, m, true);
    const order = uniq("o");
    expect(await buy(m, "main", order)).toBe("applied");
    expect(await buy(m, "main", order)).toBe("already_applied");
    expect(await access(uid)).toEqual({ active: true, love: false });
  });

  it("bump de relacionamento libera as áreas de amor; é vitalício (sem expiração)", async () => {
    const m = email("love");
    const uid = await createUser(p, m, true);
    await buy(m, "main", uniq("o"));
    expect(await buy(m, "love", uniq("l"))).toBe("applied");
    expect(await access(uid)).toEqual({ active: true, love: true });
    expect(await row(m)).not.toHaveProperty("expires_at");
  });

  it("bump chegando antes do principal não libera nada até o principal chegar", async () => {
    const m = email("order");
    const uid = await createUser(p, m, true);
    await buy(m, "love", uniq("l"));
    expect((await row(m)).status).toBe("pending");
    expect(await access(uid)).toEqual({ active: false, love: false });
    await buy(m, "main", uniq("o"));
    expect(await access(uid)).toEqual({ active: true, love: true });
  });

  it("reembolso só do bump remove só o amor", async () => {
    const m = email("rl");
    const uid = await createUser(p, m, true);
    const love = uniq("l");
    await buy(m, "main", uniq("o"));
    await buy(m, "love", love);
    expect(await revoke(love, m)).toBe("revoked_love");
    expect(await access(uid)).toEqual({ active: true, love: false });
    expect(await revoke(love, m)).toBe("already_revoked");
  });

  it("reembolso/chargeback do principal remove todo o acesso e o pedido não reativa", async () => {
    for (const reason of ["refunded", "chargeback"]) {
      const m = email(`rm-${reason}`);
      const uid = await createUser(p, m, true);
      const order = uniq("o");
      await buy(m, "main", order);
      await buy(m, "love", uniq("l"));
      expect(await revoke(order, null, reason)).toBe("revoked_main");
      expect((await row(m)).status).toBe(reason);
      expect(await access(uid)).toEqual({ active: false, love: false });
      expect(await buy(m, "main", order)).toBe("order_already_revoked");
      // Nova compra (outro pedido) reativa.
      expect(await buy(m, "main", uniq("o2"))).toBe("applied");
      expect((await access(uid)).active).toBe(true);
    }
  });

  it("reembolso que chega antes da compra bloqueia aquele pedido", async () => {
    const m = email("early");
    const order = uniq("o");
    expect(await revoke(order, m)).toBe("recorded_before_purchase");
    expect(await buy(m, "main", order)).toBe("order_already_revoked");
    expect(await revoke(uniq("x"), null)).toBe("not_found");
  });

  it("e-mail com maiúsculas/espaços é normalizado", async () => {
    const m = email("case");
    const uid = await createUser(p, m, true);
    expect(await buy(`  ${m.toUpperCase()} `, "main", uniq("o"))).toBe("applied");
    expect(await access(uid)).toEqual({ active: true, love: false });
  });

  it("valida entradas", async () => {
    await expect(buy("sem-arroba", "main", uniq("o"))).rejects.toThrow(/email/);
    await expect(buy(email("k"), "premium" as "main", uniq("o"))).rejects.toThrow(/kind/);
    await expect(buy(email("k"), "main", " ")).rejects.toThrow(/order_id/);
    await expect(revoke(uniq("o"), email("k"), "outro")).rejects.toThrow(/motivo/);
  });

  it("aluno logado não chama funções de escrita nem altera a própria linha", async () => {
    const m = email("sec");
    const uid = await createUser(p, m, true);
    await buy(m, "main", uniq("o"));
    await expect(asUser(p, uid, "select public.cakto_apply_purchase($1, 'love', 'x')", [m])).rejects.toThrow(/permission/);
    await expect(asUser(p, uid, "select public.cakto_apply_revocation('x', $1, 'refunded')", [m])).rejects.toThrow(/permission/);
    await expect(asUser(p, uid, "update public.memberships set love = true")).rejects.toThrow(/permission/);
    await expect(asUser(p, uid, "insert into public.memberships (email, base, status) values ('a@b.c', true, 'active')")).rejects.toThrow(/permission/);
    await expect(asUser(p, uid, "select public.has_love($1)", [uid])).rejects.toThrow(/permission/);
    expect(await access(uid)).toEqual({ active: true, love: false });
  });

  it("aluno só vê a própria linha; visitante não vê nada", async () => {
    const a = email("va");
    const b = email("vb");
    const ua = await createUser(p, a, true);
    await createUser(p, b, true);
    await buy(a, "main", uniq("o"));
    await buy(b, "main", uniq("o"));
    const seen = (await asUser(p, ua, "select email from public.memberships")).rows;
    expect(seen).toEqual([{ email: a }]);
    await expect(asAnon(p, "select * from public.memberships")).rejects.toThrow(/permission/);
    await expect(asAnon(p, "select * from public.my_access()")).rejects.toThrow(/permission/);
  });

  it("conta criada com o e-mail de outro comprador, sem confirmar, não pega o acesso", async () => {
    const m = email("steal");
    await buy(m, "main", uniq("o"));
    const intruder = await createUser(p, m, false);
    expect(await access(intruder)).toEqual({ active: false, love: false });
    expect((await row(m)).user_id).toBeNull();
  });
});
