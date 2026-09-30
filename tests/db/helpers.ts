import pg from "pg";

export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

export function pool() {
  return new pg.Pool({ connectionString: TEST_DATABASE_URL, max: 4 });
}

type Q = { rows: Record<string, unknown>[] };

/** Executa como service_role (o servidor do app). */
export async function asService(p: pg.Pool, sql: string, params: unknown[] = []): Promise<Q> {
  const c = await p.connect();
  try {
    await c.query("begin");
    await c.query("set local role service_role");
    const r = await c.query(sql, params);
    await c.query("commit");
    return r;
  } catch (e) {
    await c.query("rollback");
    throw e;
  } finally {
    c.release();
  }
}

/** Executa como usuário logado (RLS ativa, auth.uid() = uid). */
export async function asUser(p: pg.Pool, uid: string, sql: string, params: unknown[] = []): Promise<Q> {
  const c = await p.connect();
  try {
    await c.query("begin");
    await c.query("set local role authenticated");
    await c.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: uid, role: "authenticated" })]);
    const r = await c.query(sql, params);
    await c.query("commit");
    return r;
  } catch (e) {
    await c.query("rollback");
    throw e;
  } finally {
    c.release();
  }
}

export async function asAnon(p: pg.Pool, sql: string, params: unknown[] = []): Promise<Q> {
  const c = await p.connect();
  try {
    await c.query("begin");
    await c.query("set local role anon");
    const r = await c.query(sql, params);
    await c.query("commit");
    return r;
  } catch (e) {
    await c.query("rollback");
    throw e;
  } finally {
    c.release();
  }
}

/** Cria usuário em auth.users (como o GoTrue faria). */
export async function createUser(p: pg.Pool, email: string, confirmed: boolean): Promise<string> {
  const r = await p.query(
    "insert into auth.users (email, email_confirmed_at) values ($1, $2) returning id",
    [email, confirmed ? new Date() : null],
  );
  return r.rows[0].id as string;
}

export async function confirmUser(p: pg.Pool, id: string) {
  await p.query("update auth.users set email_confirmed_at = now() where id = $1", [id]);
}

let n = 0;
export const uniq = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(n++).toString(36)}`;
export const email = (tag: string) => `${uniq(tag)}@teste.seuuniverso`;
