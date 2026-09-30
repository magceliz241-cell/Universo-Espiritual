import { publicEnv } from "@/lib/env";

/** Checkout do bump de relacionamento dentro do app, com o e-mail da conta preenchido. */
export function loveCheckoutUrl(email: string | null): string | null {
  if (!publicEnv.checkoutLoveUrl) return null;
  const url = new URL(publicEnv.checkoutLoveUrl);
  if (email) url.searchParams.set("email", email);
  url.searchParams.set("utm_source", "app");
  url.searchParams.set("utm_medium", "upgrade");
  return url.toString();
}
