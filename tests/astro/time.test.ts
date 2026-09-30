import { describe, expect, it } from "vitest";
import { jdFromUtcMs, localToUtcMs, offsetMs, parseDate, parseTime } from "@/lib/astro/time";
import { ChartInputError } from "@/lib/astro/types";

const utc = (date: string, time: string, tz: string, fold?: 0 | 1) => {
  const d = parseDate(date);
  const t = parseTime(time);
  return new Date(localToUtcMs({ ...d, ...t }, tz, fold)).toISOString();
};
const code = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    return e instanceof ChartInputError ? e.code : "other";
  }
  return "no-error";
};

describe("fuso e horário de verão", () => {
  it("São Paulo sem horário de verão (2020): UTC−3", () => {
    expect(utc("2020-06-15", "12:00", "America/Sao_Paulo")).toBe("2020-06-15T15:00:00.000Z");
  });

  it("São Paulo com horário de verão histórico (jan/1990): UTC−2", () => {
    expect(utc("1990-01-15", "12:00", "America/Sao_Paulo")).toBe("1990-01-15T14:00:00.000Z");
  });

  it("início do horário de verão BR (2018-11-04 00:30) não existe", () => {
    expect(code(() => utc("2018-11-04", "00:30", "America/Sao_Paulo"))).toBe("nonexistent_local_time");
  });

  it("fim do horário de verão BR (2019-02-16 23:30) é ambíguo e o fold resolve", () => {
    expect(code(() => utc("2019-02-16", "23:30", "America/Sao_Paulo"))).toBe("ambiguous_local_time");
    expect(utc("2019-02-16", "23:30", "America/Sao_Paulo", 0)).toBe("2019-02-17T01:30:00.000Z");
    expect(utc("2019-02-16", "23:30", "America/Sao_Paulo", 1)).toBe("2019-02-17T02:30:00.000Z");
  });

  it("Nova York: lacuna 2021-03-14 02:30 e ambiguidade 2021-11-07 01:30", () => {
    expect(code(() => utc("2021-03-14", "02:30", "America/New_York"))).toBe("nonexistent_local_time");
    expect(code(() => utc("2021-11-07", "01:30", "America/New_York"))).toBe("ambiguous_local_time");
    expect(utc("2021-11-07", "01:30", "America/New_York", 1)).toBe("2021-11-07T06:30:00.000Z");
  });

  it("23:59 local muda a data em UTC; 00:00 funciona", () => {
    expect(utc("2021-12-31", "23:59", "America/Sao_Paulo")).toBe("2022-01-01T02:59:00.000Z");
    expect(utc("2022-01-01", "00:00", "America/Sao_Paulo")).toBe("2022-01-01T03:00:00.000Z");
  });

  it("fuso com meia hora e hemisfério leste (Índia, Nepal)", () => {
    expect(utc("2000-01-01", "05:30", "Asia/Kolkata")).toBe("2000-01-01T00:00:00.000Z");
    expect(utc("2000-01-01", "05:45", "Asia/Kathmandu")).toBe("2000-01-01T00:00:00.000Z");
  });

  it("UTC e offset", () => {
    expect(utc("2000-01-01", "12:00:00", "UTC")).toBe("2000-01-01T12:00:00.000Z");
    expect(offsetMs(Date.UTC(2020, 5, 15), "America/Sao_Paulo")).toBe(-3 * 3_600_000);
  });

  it("Dia Juliano de J2000", () => {
    expect(jdFromUtcMs(Date.UTC(2000, 0, 1, 12))).toBe(2_451_545.0);
  });
});

describe("validação de data/hora/fuso", () => {
  it("rejeita datas inexistentes e aceita 29/02 em ano bissexto", () => {
    expect(code(() => parseDate("2023-02-29"))).toBe("invalid_date");
    expect(code(() => parseDate("2024-02-29"))).toBe("no-error");
    expect(code(() => parseDate("1900-02-29"))).toBe("invalid_date");
    expect(code(() => parseDate("2000-02-29"))).toBe("no-error");
    expect(code(() => parseDate("2020-13-01"))).toBe("invalid_date");
    expect(code(() => parseDate("20-01-01"))).toBe("invalid_date");
  });

  it("rejeita anos fora do intervalo suportado", () => {
    expect(code(() => parseDate("1799-12-31"))).toBe("date_out_of_range");
    expect(code(() => parseDate("2101-01-01"))).toBe("date_out_of_range");
  });

  it("rejeita horários inválidos", () => {
    expect(code(() => parseTime("24:00"))).toBe("invalid_time");
    expect(code(() => parseTime("12:60"))).toBe("invalid_time");
    expect(code(() => parseTime("7:00"))).toBe("invalid_time");
    expect(parseTime("07:05")).toEqual({ hour: 7, minute: 5, second: 0 });
  });

  it("rejeita fuso desconhecido", () => {
    expect(code(() => utc("2020-01-01", "12:00", "America/Atlantida"))).toBe("invalid_timezone");
  });
});
