import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { normalizeCityQuery } from "@/lib/cities/normalize";
import { cityLabel } from "@/lib/cities/types";
import { parseAdmin1, parseCities, toCsv } from "../scripts/lib/geonames";

describe("normalização de cidade", () => {
  it("remove acentos, caixa e símbolos", () => {
    expect(normalizeCityQuery("  São  Paulo ")).toBe("sao paulo");
    expect(normalizeCityQuery("Itaú de Minas")).toBe("itau de minas");
    expect(normalizeCityQuery("Sant'Ana do Livramento")).toBe("sant'ana do livramento");
    expect(normalizeCityQuery("Recife%_")).toBe("recife");
    expect(normalizeCityQuery("Göttingen")).toBe("gottingen");
  });
});

describe("importação GeoNames", () => {
  const admin1 = parseAdmin1(readFileSync("tests/fixtures/geonames/admin1-sample.txt", "utf8"));
  const rows = parseCities(readFileSync("tests/fixtures/geonames/cities-sample.txt", "utf8"), admin1, "2026-10-01");

  it("só lugares povoados, com fuso e estado", () => {
    expect([...rows.keys()].sort()).toEqual([2643743, 3390760, 3448439, 3471872]);
    expect(rows.get(3448439)).toMatchObject({
      name: "São Paulo",
      search_name: "sao paulo",
      admin1_name: "São Paulo",
      timezone: "America/Sao_Paulo",
      country_code: "BR",
      source_dump: "2026-10-01",
    });
    expect(rows.get(3471872)?.timezone).toBe("America/Maceio");
    expect(cityLabel(rows.get(3390760)!)).toBe("Recife, Pernambuco, BR");
  });

  it("CSV com cabeçalho e aspas quando necessário", () => {
    const csv = toCsv([{ ...rows.get(3448439)!, name: 'A, "B"' }]);
    const [header, line] = csv.trim().split("\n");
    expect(header.split(",")).toHaveLength(13);
    expect(line).toContain('"A, ""B"""');
  });
});
