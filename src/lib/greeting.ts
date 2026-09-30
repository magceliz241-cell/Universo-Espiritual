/** Saudação pelo horário local do fuso informado. */
export function greeting(timezone = "America/Sao_Paulo", now = new Date()): string {
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", hourCycle: "h23" }).format(now));
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function formatDatePt(d: Date | string, timezone = "America/Sao_Paulo", opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" }) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: timezone, ...opts }).format(typeof d === "string" ? new Date(d) : d);
}
