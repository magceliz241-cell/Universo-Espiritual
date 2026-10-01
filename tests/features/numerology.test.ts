import { describe, expect, it } from "vitest";
import {
  birthday, expression, lifePath, normalizeName, numerologyProfile, personality, personalYear, reduce, soulUrge,
} from "@/lib/numerology/pythagorean";

describe("redução", () => {
  it("preserva mestres só quando pedido", () => {
    expect(reduce(38)).toBe(11);
    expect(reduce(33)).toBe(33);
    expect(reduce(44)).toBe(8);
    expect(reduce(29, [])).toBe(2);
    expect(reduce(1990)).toBe(1);
  });
});

describe("Caminho de Vida (3 ciclos)", () => {
  it("exemplo comum", () => {
    const r = lifePath("1990-08-15");
    expect(r).toMatchObject({ value: 6, raw_components: [8, 15, 1990], reduced_components: [8, 6, 1] });
    expect(r.method).toBe("pythagorean");
    expect(r.method_version).toBe("numerology-pyth-1.0.0");
  });
  it("mestres 11, 22 e 33", () => {
    expect(lifePath("1980-11-09").value).toBe(11);
    expect(lifePath("1996-11-04").value).toBe(22);
    expect(lifePath("1996-04-22").value).toBe(33);
    expect(lifePath("1985-11-29").reduced_components).toEqual([11, 11, 5]);
  });
});

describe("nome", () => {
  it("normaliza acentos de forma uniforme", () => {
    expect(normalizeName("Conceição d'Ávila")).toBe("CONCEICAODAVILA");
    expect(expression("José").value).toBe(expression("JOSE").value);
  });
  it("expressão, alma e personalidade", () => {
    expect(expression("Conceição").value).toBe(5); // 41
    expect(soulUrge("Conceição").value).toBe(9); // 27
    expect(personality("Conceição").value).toBe(5); // 14
    expect(expression("Sai").value).toBe(11); // mestre preservado
  });
  it("Y é consoante nesta versão", () => {
    expect(soulUrge("Yara").raw_components).toEqual([1, 1]);
    expect(personality("Yara").raw_components).toEqual([7, 9]);
  });
});

describe("aniversário e ano pessoal", () => {
  it("aniversário preserva 11 e 22", () => {
    expect(birthday("2000-01-29").value).toBe(11);
    expect(birthday("2000-01-22").value).toBe(22);
    expect(birthday("2000-01-31").value).toBe(4);
  });
  it("ano pessoal é ciclo 1–9", () => {
    expect(personalYear("1990-08-15", 2026).value).toBe(6);
    expect(personalYear("1980-11-09", 2027).value).toBeLessThanOrEqual(9);
  });
});

describe("perfil", () => {
  it("sem nome, só métricas de data; determinístico", () => {
    const a = numerologyProfile({ birthDate: "1990-08-15", fullName: null, currentYear: 2026 });
    expect(a.metrics.map((m) => m.metric)).toEqual(["life-path", "birthday", "personal-year"]);
    const b = numerologyProfile({ birthDate: "1990-08-15", fullName: "Ana Souza", currentYear: 2026 });
    expect(b.metrics.map((m) => m.metric)).toEqual(["life-path", "expression", "soul-urge", "personality", "birthday", "personal-year"]);
    expect(numerologyProfile({ birthDate: "1990-08-15", fullName: "Ana Souza", currentYear: 2026 })).toEqual(b);
  });
});
