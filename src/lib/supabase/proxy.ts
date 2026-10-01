import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { ACCESS_HEADER, decide, TIER_HEADER, USER_HEADER } from "@/lib/auth/routes";
import { devFakeAccess, publicEnv, supabaseConfigured } from "@/lib/env";

/**
 * Renova a sessão (cookies) e aplica as regras de acesso.
 * Define x-su-access / x-su-tier / x-su-user para as páginas lerem no servidor.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const headers = new Headers(request.headers);
  headers.delete(ACCESS_HEADER);
  headers.delete(TIER_HEADER);
  headers.delete(USER_HEADER);

  const fake = devFakeAccess();
  if (fake) {
    headers.set(ACCESS_HEADER, "1");
    headers.set(TIER_HEADER, fake);
    headers.set(USER_HEADER, "00000000-0000-4000-8000-000000000000");
    return NextResponse.next({ request: { headers } });
  }

  if (!supabaseConfigured()) {
    const d = decide(path, request.nextUrl.search, { userId: null, access: null });
    if (d.action === "next") return NextResponse.next({ request: { headers } });
    return NextResponse.redirect(new URL("/auth/error?reason=config", request.url));
  }

  let response = NextResponse.next({ request: { headers } });
  const supabase = createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request: { headers } });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
      },
    },
  });

  // Valida o JWT (não confie em getSession no servidor).
  const { data } = await supabase.auth.getClaims();
  const userId = (data?.claims?.sub as string | undefined) ?? null;

  let access: { active: boolean; love: boolean } | null = null;
  if (userId) {
    const { data: rows } = await supabase.rpc("my_access");
    const row = Array.isArray(rows) ? rows[0] : rows;
    access = row ? { active: Boolean(row.active), love: Boolean(row.love) } : { active: false, love: false };
  }

  const d = decide(path, request.nextUrl.search, { userId, access });
  const withCookies = (res: NextResponse) => {
    for (const c of response.cookies.getAll()) res.cookies.set(c);
    return res;
  };

  switch (d.action) {
    case "next":
      if (userId) {
        headers.set(USER_HEADER, userId);
        response = rebuild(response, headers);
      }
      return response;
    case "login": {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("next", d.next);
      return withCookies(NextResponse.redirect(url));
    }
    case "no_access":
      return withCookies(NextResponse.redirect(new URL("/acesso", request.url)));
    case "allow":
      headers.set(ACCESS_HEADER, "1");
      headers.set(TIER_HEADER, d.tier);
      headers.set(USER_HEADER, userId as string);
      return rebuild(response, headers);
  }
}

function rebuild(prev: NextResponse, headers: Headers) {
  const res = NextResponse.next({ request: { headers } });
  for (const c of prev.cookies.getAll()) res.cookies.set(c);
  return res;
}
