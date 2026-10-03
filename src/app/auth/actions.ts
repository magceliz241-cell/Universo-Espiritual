"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { safeNext } from "@/lib/auth/safe-next";
import { publicEnv, supabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  ok?: boolean;
  message?: string;
  code?: string;
  email?: string;
}

const emailSchema = z.string().trim().toLowerCase().email();
const passwordSchema = z.string().min(8, "A senha precisa ter pelo menos 8 caracteres.").max(72);

const notConfigured: AuthState = { message: "O login ainda não está configurado neste ambiente.", code: "config" };

export async function signInAction(_: AuthState, form: FormData): Promise<AuthState> {
  if (!supabaseConfigured()) return notConfigured;
  const email = emailSchema.safeParse(form.get("email"));
  const password = z.string().min(1).safeParse(form.get("password"));
  if (!email.success || !password.success) return { message: "Confira o e-mail e a senha.", code: "invalid_input" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: email.data, password: password.data });
  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        message: "Seu e-mail ainda não foi confirmado. Procure a mensagem na caixa de entrada, no spam ou em Promoções.",
        code: "email_not_confirmed",
        email: email.data,
      };
    }
    return { message: "E-mail ou senha incorretos.", code: "invalid_credentials", email: email.data };
  }
  redirect(safeNext(String(form.get("next") ?? ""), "/"));
}

export async function signUpAction(_: AuthState, form: FormData): Promise<AuthState> {
  if (!supabaseConfigured()) return notConfigured;
  const email = emailSchema.safeParse(form.get("email"));
  if (!email.success) return { message: "Informe um e-mail válido.", code: "invalid_email" };
  const password = passwordSchema.safeParse(form.get("password"));
  if (!password.success) return { message: password.error.issues[0].message, code: "weak_password", email: email.data };
  if (form.get("password") !== form.get("confirm")) {
    return { message: "As senhas não conferem.", code: "password_mismatch", email: email.data };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.data,
    password: password.data,
    options: { emailRedirectTo: `${publicEnv.appUrl}/auth/confirm?next=/` },
  });
  if (error) {
    if (error.code === "over_email_send_rate_limit") {
      return { message: "Muitos envios em pouco tempo. Tente de novo em alguns minutos.", code: error.code };
    }
    return { message: "Não conseguimos criar sua conta agora. Tente novamente.", code: error.code ?? "error" };
  }
  // E-mail já cadastrado e confirmado: o Supabase devolve identities vazio.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      ok: false,
      code: "already_registered",
      message: "Esse e-mail já tem conta. Entre com sua senha ou recupere o acesso.",
      email: email.data,
    };
  }
  return { ok: true, code: "check_email", email: email.data };
}

export async function resendConfirmationAction(_: AuthState, form: FormData): Promise<AuthState> {
  if (!supabaseConfigured()) return notConfigured;
  const email = emailSchema.safeParse(form.get("email"));
  if (!email.success) return { message: "Informe um e-mail válido.", code: "invalid_email" };
  const supabase = await createClient();
  await supabase.auth.resend({
    type: "signup",
    email: email.data,
    options: { emailRedirectTo: `${publicEnv.appUrl}/auth/confirm?next=/` },
  });
  // Resposta igual com ou sem conta (não revela quem está cadastrado).
  return { ok: true, code: "resent", email: email.data, message: "Se houver um cadastro pendente, enviamos um novo link." };
}

export async function forgotPasswordAction(_: AuthState, form: FormData): Promise<AuthState> {
  if (!supabaseConfigured()) return notConfigured;
  const email = emailSchema.safeParse(form.get("email"));
  if (!email.success) return { message: "Informe um e-mail válido.", code: "invalid_email" };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email.data, {
    redirectTo: `${publicEnv.appUrl}/auth/confirm?next=/auth/update-password`,
  });
  return { ok: true, code: "sent", email: email.data };
}

export async function updatePasswordAction(_: AuthState, form: FormData): Promise<AuthState> {
  if (!supabaseConfigured()) return notConfigured;
  const password = passwordSchema.safeParse(form.get("password"));
  if (!password.success) return { message: password.error.issues[0].message, code: "weak_password" };
  if (form.get("password") !== form.get("confirm")) return { message: "As senhas não conferem.", code: "password_mismatch" };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: password.data });
  if (error) {
    return { message: "O link expirou. Peça um novo e-mail de recuperação.", code: error.code ?? "error" };
  }
  redirect("/");
}

/**
 * Conta logada (ex.: Google) com e-mail diferente do da compra: pede a troca do e-mail da conta para o do checkout.
 * O Supabase envia um link para esse e-mail; só depois da confirmação o e-mail muda e o gatilho
 * link_memberships_on_confirm liga a compra a esta conta. Digitar o e-mail sozinho não libera nada.
 */
export async function claimPurchaseEmailAction(_: AuthState, form: FormData): Promise<AuthState> {
  if (!supabaseConfigured()) return notConfigured;
  const email = emailSchema.safeParse(form.get("email"));
  if (!email.success) return { message: "Informe um e-mail válido.", code: "invalid_email" };

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { message: "Sua sessão expirou. Entre de novo.", code: "no_session" };
  if (data.user.email?.toLowerCase() === email.data) {
    return { message: "Esse já é o e-mail desta conta.", code: "same_email", email: email.data };
  }

  const { error } = await supabase.auth.updateUser(
    { email: email.data },
    { emailRedirectTo: `${publicEnv.appUrl}/auth/confirm?next=/` },
  );
  if (error) {
    if (error.code === "email_exists") {
      return {
        message: "Já existe uma conta com esse e-mail. Saia e entre com ele (se não lembrar a senha, use “Esqueci minha senha”).",
        code: error.code,
        email: email.data,
      };
    }
    if (error.code === "over_email_send_rate_limit" || error.status === 429) {
      return { message: "Muitos envios em pouco tempo. Tente de novo em alguns minutos.", code: "rate_limited", email: email.data };
    }
    return { message: "Não conseguimos enviar o e-mail agora. Tente novamente.", code: error.code ?? "error", email: email.data };
  }
  return { ok: true, code: "claim_sent", email: email.data };
}
