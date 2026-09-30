import { ChartInputError } from "./types";

/**
 * Conversão horário local (fuso IANA) → UTC → Dia Juliano.
 *
 * Usa a base IANA embutida no Node (Intl/ICU), que inclui o histórico de horário
 * de verão (ex.: Brasil até 2019). Horários que não existem (pulo do horário de
 * verão) ou que existem duas vezes (fim do horário de verão) NUNCA são
 * resolvidos em silêncio: geram ChartInputError, e o segundo caso aceita `fold`.
 */

export const MIN_YEAR = 1800;
export const MAX_YEAR = 2100;

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export interface LocalDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export function parseDate(date: string): Pick<LocalDateTime, "year" | "month" | "day"> {
  const m = DATE_RE.exec(date);
  if (!m) throw new ChartInputError("invalid_date", `Data inválida: ${date}`);
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
    throw new ChartInputError("invalid_date", `Data inexistente: ${date}`);
  }
  if (year < MIN_YEAR || year > MAX_YEAR) {
    throw new ChartInputError("date_out_of_range", `Ano fora do intervalo suportado (${MIN_YEAR}–${MAX_YEAR}).`);
  }
  return { year, month, day };
}

export function parseTime(time: string): Pick<LocalDateTime, "hour" | "minute" | "second"> {
  const m = TIME_RE.exec(time);
  if (!m) throw new ChartInputError("invalid_time", `Horário inválido: ${time}`);
  const [hour, minute, second] = [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)];
  if (hour > 23 || minute > 59 || second > 59) {
    throw new ChartInputError("invalid_time", `Horário inválido: ${time}`);
  }
  return { hour, minute, second };
}

const formatters = new Map<string, Intl.DateTimeFormat>();

export function assertTimeZone(timezone: string): void {
  if (typeof timezone !== "string" || timezone.length === 0 || timezone.length > 64) {
    throw new ChartInputError("invalid_timezone", "Fuso horário inválido.");
  }
  getFormatter(timezone);
}

function getFormatter(timezone: string): Intl.DateTimeFormat {
  let f = formatters.get(timezone);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        era: "short",
      });
    } catch {
      throw new ChartInputError("invalid_timezone", `Fuso horário desconhecido: ${timezone}`);
    }
    formatters.set(timezone, f);
  }
  return f;
}

/** Campos do relógio local no fuso para um instante UTC (ms). */
export function localFields(utcMs: number, timezone: string): LocalDateTime {
  const parts = getFormatter(timezone).formatToParts(new Date(utcMs));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  let year = Number(get("year"));
  if (get("era") === "BC") year = 1 - year;
  return {
    year,
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

const asUtcMs = (f: LocalDateTime) =>
  Date.UTC(f.year, f.month - 1, f.day, f.hour, f.minute, f.second);

/** Offset do fuso (ms) no instante dado: local − UTC. */
export function offsetMs(utcMs: number, timezone: string): number {
  return asUtcMs(localFields(Math.floor(utcMs / 1000) * 1000, timezone)) - Math.floor(utcMs / 1000) * 1000;
}

/**
 * Converte horário local para instante UTC (ms), detectando lacunas e sobreposições.
 */
export function localToUtcMs(local: LocalDateTime, timezone: string, fold?: 0 | 1): number {
  const wall = asUtcMs(local);
  const day = 86_400_000;
  // Offsets antes/depois cobrem qualquer transição num intervalo de ±1 dia.
  const offsets = [...new Set([offsetMs(wall - day, timezone), offsetMs(wall, timezone), offsetMs(wall + day, timezone)])];
  const candidates = [...new Set(offsets.map((o) => wall - o))]
    .filter((t) => asUtcMs(localFields(t, timezone)) === wall)
    .sort((a, b) => a - b);

  if (candidates.length === 0) {
    throw new ChartInputError(
      "nonexistent_local_time",
      "Esse horário não existiu nesse local (mudança para o horário de verão).",
      { timezone },
    );
  }
  if (candidates.length > 1) {
    if (fold === 0 || fold === 1) return candidates[fold];
    throw new ChartInputError(
      "ambiguous_local_time",
      "Esse horário aconteceu duas vezes nesse local (fim do horário de verão). Escolha a primeira ou a segunda ocorrência.",
      {
        timezone,
        options: candidates.map((t, i) => ({ fold: i, utc: new Date(t).toISOString(), offset_minutes: offsetMs(t, timezone) / 60_000 })),
      },
    );
  }
  return candidates[0];
}

/** Dia Juliano (UT) de um instante UTC em ms. */
export function jdFromUtcMs(utcMs: number): number {
  return utcMs / 86_400_000 + 2_440_587.5;
}
