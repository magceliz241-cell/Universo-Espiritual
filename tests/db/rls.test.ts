import { afterAll, describe, expect, it } from "vitest";
import { asAnon, asService, asUser, createUser, email, pool, TEST_DATABASE_URL } from "./helpers";

describe.skipIf(!TEST_DATABASE_URL)("RLS das tabelas do usuário e cidades", () => {
  const p = pool();
  afterAll(() => p.end());

  const newProfile = (uid: string, kind = "self") =>
    asUser(
      p,
      uid,
      `insert into public.birth_profiles (user_id, kind, name, birth_date, birth_time, timezone, latitude, longitude)
       values ($1, $2, 'Eu', '1990-08-15', '14:30', 'America/Sao_Paulo', -23.55, -46.63) returning id`,
      [uid, kind],
    ).then((r) => r.rows[0].id as string);

  it("perfil é criado automaticamente com o usuário", async () => {
    const uid = await createUser(p, email("prof"), true);
    const r = await asUser(p, uid, "select id from public.profiles");
    expect(r.rows).toEqual([{ id: uid }]);
  });

  it("A não lê nem altera dados de B; não insere em nome de B", async () => {
    const a = await createUser(p, email("a"), true);
    const b = await createUser(p, email("b"), true);
    const pb = await newProfile(b);
    expect((await asUser(p, a, "select * from public.birth_profiles where id = $1", [pb])).rows).toEqual([]);
    const upd = await asUser(p, a, "update public.birth_profiles set name = 'x' where id = $1 returning id", [pb]);
    expect(upd.rows).toEqual([]);
    await expect(
      asUser(
        p,
        a,
        `insert into public.birth_profiles (user_id, kind, name, birth_date, birth_time, timezone, latitude, longitude)
         values ($1, 'partner', 'X', '1990-01-01', '10:00', 'UTC', 0, 0)`,
        [b],
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it("um único perfil 'self' por pessoa; parceiros ilimitados", async () => {
    const a = await createUser(p, email("self"), true);
    await newProfile(a, "self");
    await newProfile(a, "partner");
    await newProfile(a, "partner");
    await expect(newProfile(a, "self")).rejects.toThrow(/duplicate key/);
  });

  it("mapa não pode apontar para o perfil de outra pessoa (FK composta)", async () => {
    const a = await createUser(p, email("fa"), true);
    const b = await createUser(p, email("fb"), true);
    const pb = await newProfile(b);
    await expect(
      asUser(
        p,
        a,
        `insert into public.birth_charts (user_id, birth_profile_id, input_hash, input, timezone, latitude, longitude,
           engine, engine_version, engine_wrapper, method, zodiac, house_system, methodology_version, chart)
         values ($1, $2, repeat('a', 64), '{}', 'UTC', 0, 0, 'xalen', 'c', 'w', 'analytical', 'tropical', 'placidus', 'v', '{}')`,
        [a, pb],
      ),
    ).rejects.toThrow(/foreign key/);
  });

  it("visitante não acessa tabelas do usuário", async () => {
    for (const t of ["profiles", "birth_profiles", "birth_charts", "tarot_readings", "dream_entries", "ai_generations"]) {
      await expect(asAnon(p, `select * from public.${t}`)).rejects.toThrow(/permission/);
    }
  });

  it("cidades: leitura pública, busca por prefixo e similaridade, sem escrita", async () => {
    await asService(
      p,
      `insert into public.cities (id, name, ascii_name, search_name, admin1_code, admin1_name, country_code,
         latitude, longitude, timezone, population, feature_code, source_dump) values
       (3448439, 'São Paulo', 'Sao Paulo', 'sao paulo', '27', 'São Paulo', 'BR', -23.5475, -46.63611, 'America/Sao_Paulo', 10021295, 'PPLA', '2026-09-01'),
       (3448636, 'São Pedro', 'Sao Pedro', 'sao pedro', '27', 'São Paulo', 'BR', -22.5483, -47.9139, 'America/Sao_Paulo', 28000, 'PPL', '2026-09-01'),
       (3390760, 'Recife', 'Recife', 'recife', '30', 'Pernambuco', 'BR', -8.05389, -34.88111, 'America/Recife', 1478098, 'PPLA', '2026-09-01')
       on conflict (id) do nothing`,
    );
    const pref = await asAnon(p, "select name from public.search_cities('sao p')");
    expect(pref.rows.map((r) => r.name)).toEqual(["São Paulo", "São Pedro"]);
    const fuzzy = await asAnon(p, "select name from public.search_cities('recif')");
    expect(fuzzy.rows[0].name).toBe("Recife");
    const typo = await asAnon(p, "select name from public.search_cities('recfe')");
    expect(typo.rows.map((r) => r.name)).toContain("Recife");
    expect((await asAnon(p, "select name from public.search_cities('s')")).rows).toEqual([]);
    await expect(
      asAnon(p, "insert into public.cities (id, name, ascii_name, search_name, country_code, latitude, longitude, timezone, source_dump) values (1,'x','x','x','BR',0,0,'UTC','2026-01-01')"),
    ).rejects.toThrow(/permission/);
  });
});
