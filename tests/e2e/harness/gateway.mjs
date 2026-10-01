// Gateway de TESTE que imita o Supabase localmente (nunca usar em produção):
//   /rest/v1/*  → PostgREST (porta PGRST_PORT)
//   /auth/v1/*  → Auth simplificado (signup, login, verify por token_hash, recover, resend, user, logout)
//   /__outbox   → links "enviados por e-mail" (para os testes pegarem o token_hash)
// Dependências: node:http, node:crypto e pg.
import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import http from "node:http";
import pg from "pg";

const PORT = Number(process.env.GATEWAY_PORT ?? 54321);
const PGRST = `http://127.0.0.1:${process.env.PGRST_PORT ?? 3001}`;
const SECRET = process.env.JWT_SECRET;
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });
if (!SECRET) throw new Error("JWT_SECRET obrigatório");

const b64u = (b) => Buffer.from(b).toString("base64url");
export function signJwt(payload) {
  const h = b64u(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const p = b64u(JSON.stringify(payload));
  return `${h}.${p}.${createHmac("sha256", SECRET).update(`${h}.${p}`).digest("base64url")}`;
}
function verifyJwt(token) {
  const [h, p, s] = String(token ?? "").split(".");
  if (!h || !p || !s) return null;
  const expected = createHmac("sha256", SECRET).update(`${h}.${p}`).digest("base64url");
  if (s.length !== expected.length || !timingSafeEqual(Buffer.from(s), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(p, "base64url").toString());
  if (payload.exp && payload.exp < Date.now() / 1000) return null;
  return payload;
}

const passwords = new Map(); // email → {salt, hash}
const refreshTokens = new Map(); // token → userId
const outbox = []; // {type, email, token_hash, at}
const tokenHashes = new Map(); // token_hash → {email, type}

const hashPw = (pw, salt = randomBytes(8).toString("hex")) => ({ salt, hash: scryptSync(pw, salt, 32).toString("hex") });

function userJson(u) {
  return {
    id: u.id,
    aud: "authenticated",
    role: "authenticated",
    email: u.email,
    email_confirmed_at: u.email_confirmed_at,
    confirmed_at: u.email_confirmed_at,
    created_at: u.created_at,
    updated_at: u.updated_at ?? u.created_at,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {},
    identities: [{ id: u.id, user_id: u.id, provider: "email", identity_data: { email: u.email, sub: u.id } }],
  };
}

function session(u) {
  const now = Math.floor(Date.now() / 1000);
  const expires_in = 3600;
  const access_token = signJwt({
    sub: u.id, aud: "authenticated", role: "authenticated", email: u.email, iat: now, exp: now + expires_in, session_id: randomUUID(),
  });
  const refresh_token = randomBytes(16).toString("hex");
  refreshTokens.set(refresh_token, u.id);
  return { access_token, token_type: "bearer", expires_in, expires_at: now + expires_in, refresh_token, user: userJson(u) };
}

async function findUser(where, value) {
  const r = await db.query(`select * from auth.users where ${where} = $1`, [value]);
  return r.rows[0] ?? null;
}

function mail(type, email) {
  const token_hash = randomBytes(20).toString("hex");
  tokenHashes.set(token_hash, { email, type });
  outbox.push({ type, email, token_hash, at: Date.now() });
}

const send = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
  res.end(body === undefined ? "" : JSON.stringify(body));
};
const err = (res, status, error_code, msg) => send(res, status, { code: status, error_code, msg });

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString();
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function auth(req, res, path, url) {
  const body = req.method === "GET" ? {} : await readBody(req);
  const bearer = (req.headers.authorization ?? "").replace(/^Bearer\s+/i, "");

  if (path === "/signup" && req.method === "POST") {
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email.includes("@")) return err(res, 400, "validation_failed", "email inválido");
    const existing = await findUser("lower(email)", email);
    if (existing?.email_confirmed_at) return send(res, 200, { ...userJson(existing), identities: [] });
    let u = existing;
    if (!u) u = (await db.query("insert into auth.users (email) values ($1) returning *", [email])).rows[0];
    passwords.set(email, hashPw(String(body.password ?? "")));
    mail("signup", email);
    return send(res, 200, userJson(u));
  }

  if (path === "/token" && req.method === "POST") {
    const grant = url.searchParams.get("grant_type");
    if (grant === "password") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const u = await findUser("lower(email)", email);
      const pw = passwords.get(email);
      if (!u || !pw || hashPw(String(body.password ?? ""), pw.salt).hash !== pw.hash) {
        return err(res, 400, "invalid_credentials", "Invalid login credentials");
      }
      if (!u.email_confirmed_at) return err(res, 400, "email_not_confirmed", "Email not confirmed");
      return send(res, 200, session(u));
    }
    if (grant === "refresh_token") {
      const uid = refreshTokens.get(body.refresh_token);
      if (!uid) return err(res, 400, "refresh_token_not_found", "Invalid Refresh Token");
      refreshTokens.delete(body.refresh_token);
      return send(res, 200, session(await findUser("id", uid)));
    }
    return err(res, 400, "unsupported_grant_type", "grant");
  }

  if (path === "/verify" && req.method === "POST") {
    const t = tokenHashes.get(body.token_hash);
    if (!t) return err(res, 403, "otp_expired", "Email link is invalid or has expired");
    tokenHashes.delete(body.token_hash);
    if (t.type === "signup" || body.type === "email" || body.type === "signup") {
      await db.query("update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()) where lower(email) = $1", [t.email]);
    }
    return send(res, 200, session(await findUser("lower(email)", t.email)));
  }

  if ((path === "/recover" || path === "/resend") && req.method === "POST") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const u = await findUser("lower(email)", email);
    if (u) {
      if (path === "/recover") mail("recovery", email);
      else if (!u.email_confirmed_at) mail("signup", email);
    }
    return send(res, 200, {});
  }

  if (path === "/user") {
    const claims = verifyJwt(bearer);
    if (!claims || claims.role !== "authenticated") return err(res, 401, "bad_jwt", "invalid JWT");
    const u = await findUser("id", claims.sub);
    if (!u) return err(res, 403, "user_not_found", "User not found");
    if (req.method === "PUT") {
      if (body.password) passwords.set(u.email.toLowerCase(), hashPw(String(body.password)));
      await db.query("update auth.users set updated_at = now() where id = $1", [u.id]);
    }
    return send(res, 200, userJson(u));
  }

  if (path === "/logout") return send(res, 204);
  if (path === "/settings") return send(res, 200, { external: { email: true }, mailer_autoconfirm: false });
  return err(res, 404, "not_found", path);
}

function proxyRest(req, res, path) {
  const target = new URL(PGRST + path.replace(/^\/rest\/v1/, ""));
  const headers = { ...req.headers, host: target.host };
  // O PostgREST valida o JWT do Authorization; sem Authorization, usa o apikey (anon).
  if (!headers.authorization && headers.apikey) headers.authorization = `Bearer ${headers.apikey}`;
  const p = http.request(target, { method: req.method, headers }, (r) => {
    res.writeHead(r.statusCode ?? 502, r.headers);
    r.pipe(res);
  });
  p.on("error", () => send(res, 502, { message: "postgrest indisponível" }));
  req.pipe(p);
}

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
      if (req.method === "OPTIONS") {
        res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*" });
        return res.end();
      }
      if (url.pathname === "/__outbox") return send(res, 200, outbox);
      if (url.pathname.startsWith("/auth/v1")) return await auth(req, res, url.pathname.slice("/auth/v1".length), url);
      if (url.pathname.startsWith("/rest/v1")) return proxyRest(req, res, url.pathname + url.search);
      return send(res, 404, { message: "not found" });
    } catch (e) {
      console.error(e);
      send(res, 500, { message: String(e) });
    }
  })
  .listen(PORT, "127.0.0.1", () => console.log(`gateway em http://127.0.0.1:${PORT}`));
