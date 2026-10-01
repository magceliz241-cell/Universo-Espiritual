import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { safeNext } from "@/lib/auth/safe-next";
import { supabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/**
 * Link dos e-mails de confirmação/recuperação: /auth/confirm?token_hash=…&type=…&next=…
 * (verifyOtp funciona em qualquer aparelho, diferente do link com code).
 */
export async function GET(request: NextRequest) {
  if (!supabaseConfigured()) return NextResponse.redirect(new URL("/auth/error?reason=config", request.url));
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"), "/");
  const allowed: EmailOtpType[] = ["email", "signup", "recovery", "email_change", "invite", "magiclink"];

  if (tokenHash && type && allowed.includes(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL("/auth/error?reason=link", request.url));
}
