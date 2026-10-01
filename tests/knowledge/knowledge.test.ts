import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SIGNS } from "@/lib/astro/zodiac";
import { ASPECT_ANGLES } from "@/lib/astro/aspects";
import { synastry } from "@/lib/astro/synastry";
import { XalenEphemerisEngine } from "@/lib/astro/xalen-engine";
import { extractDreamSymbols } from "@/lib/dreams/extract";
import { DREAM_SYMBOLS } from "@/lib/dreams/symbols";
import { DOCS, KNOWLEDGE_VERSION } from "@/lib/knowledge/generated";
import { kb } from "@/lib/knowledge/ids";
import {
  DEFAULT_BUDGET_CHARS,
  editorialRules,
  retrieveDream,
  retrieveLoveProfile,
  retrieveMoonToday,
  retrieveNatalSummary,
  retrieveNumerology,
  retrieveSynastry,
  retrieveTarot,
} from "@/lib/knowledge/retrieve";
import { DECK } from "@/lib/tarot/deck";
import { loadKnowledge, renderModule } from "../../scripts/lib/knowledge";

describe("índice da KB", () => {
  it("generated.ts está sincronizado com knowledge/ (rode npm run build:knowledge)", () => {
    expect(readFileSync("src/lib/knowledge/generated.ts", "utf8")).toBe(renderModule(loadKnowledge("knowledge")));
  });

  it("versão = versão do INDEX.json + hash do conteúdo", () => {
    expect(KNOWLEDGE_VERSION).toMatch(/^2\.0\+[0-9a-f]{12}$/);
  });

  it("conteúdo para a IA não carrega URLs de fonte (ficam em sources)", () => {
    for (const d of Object.values(DOCS)) expect(d.content, d.id).not.toMatch(/https?:\/\//);
    expect(DOCS["dreams/methodology"].sources).toContain("https://dictionary.apa.org/dream-analysis");
  });

  it("arquivos técnicos não vão para a IA", () => {
    expect(DOCS.XALEN_INTEGRATION).toBeUndefined();
    expect(DOCS.SOURCES).toBeUndefined();
  });
});

describe("todos os mapeamentos apontam para documentos existentes", () => {
  it("astrologia", () => {
    for (const s of SIGNS) expect(DOCS[kb.sign(s)], s).toBeDefined();
    for (const p of ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"] as const)
      expect(DOCS[kb.planet(p)], p).toBeDefined();
    for (let h = 1; h <= 12; h++) expect(DOCS[kb.house(h)], `casa ${h}`).toBeDefined();
    for (const a of Object.keys(ASPECT_ANGLES) as (keyof typeof ASPECT_ANGLES)[]) expect(DOCS[kb.aspect(a)], a).toBeDefined();
  });

  it("numerologia, Lua, Tarot e sonhos", () => {
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]) expect(DOCS[kb.number(n)], String(n)).toBeDefined();
    for (const p of ["new-moon", "waxing-crescent", "first-quarter", "waxing-gibbous", "full-moon", "waning-gibbous", "last-quarter", "waning-crescent"])
      expect(DOCS[kb.moonPhase(p)], p).toBeDefined();
    for (const c of DECK) expect(DOCS[c.kb], c.id).toBeDefined();
    for (const s of DREAM_SYMBOLS) expect(DOCS[kb.dreamSymbol(s.slug)], s.slug).toBeDefined();
  });

  it("baralho RWS completo: 78 cartas, 22 Maiores, 14 por naipe, ids únicos", () => {
    expect(DECK).toHaveLength(78);
    expect(DECK.filter((c) => c.arcana === "major")).toHaveLength(22);
    for (const s of ["wands", "cups", "swords", "pentacles"]) expect(DECK.filter((c) => c.suit === s)).toHaveLength(14);
    expect(new Set(DECK.map((c) => c.id)).size).toBe(78);
    expect(DECK[8].name).toBe("A Força");
    expect(DECK[11].name).toBe("A Justiça");
  });
});

describe("recuperação por tarefa", () => {
  const engine = new XalenEphemerisEngine();
  const A = engine.calculateChartSync(
    { date: "1990-08-15", time: "14:30", timezone: "America/Sao_Paulo", latitude: -23.5505, longitude: -46.6333 },
    { houseSystem: "placidus" },
  );
  const B = engine.calculateChartSync(
    { date: "1992-03-02", time: "06:10", timezone: "America/Recife", latitude: -8.0476, longitude: -34.877 },
    { houseSystem: "placidus" },
  );
  const ids = (ctx: { docs: { id: string }[] }) => ctx.docs.map((d) => d.id);
  const size = (ctx: { docs: { content: string }[] }) => ctx.docs.reduce((n, d) => n + d.content.length, 0);

  it("resumo natal: Sol/Lua/ASC e nada de outros domínios", () => {
    const ctx = retrieveNatalSummary(A);
    expect(ids(ctx)).toContain(kb.sign(A.planets.sun.sign));
    expect(ids(ctx)).toContain(kb.sign(A.planets.moon.sign));
    expect(ids(ctx)).toContain(kb.sign(A.angles!.ascendant.sign));
    expect(ids(ctx).every((id) => id.startsWith("astrology/"))).toBe(true);
    expect(ctx.knowledgeVersion).toBe(KNOWLEDGE_VERSION);
  });

  it("perfil amoroso: Vênus, Marte, casas 5 e 7, signos certos", () => {
    const ctx = retrieveLoveProfile(A);
    expect(ids(ctx)).toEqual(expect.arrayContaining([kb.planet("venus"), kb.planet("mars"), kb.house(5), kb.house(7), kb.sign(A.planets.venus.sign)]));
    expect(ids(ctx)).not.toContain(kb.planet("pluto"));
  });

  it("sinastria: metodologia + contatos-chave", () => {
    const ctx = retrieveSynastry(synastry(A, B), A, B);
    expect(ids(ctx)[0]).toBe(kb.synastry);
    expect(ids(ctx).every((id) => id.startsWith("astrology/"))).toBe(true);
  });

  it("Tarot: só as cartas sorteadas", () => {
    const ctx = retrieveTarot("love-3-cards", ["major-06", "cups-two", "swords-ten"]);
    const cardDocs = ids(ctx).filter((id) => id.includes("arcana"));
    expect(cardDocs).toEqual([
      "tarot/major-arcana/06-the-lovers",
      "tarot/minor-arcana/cups/two-cups",
      "tarot/minor-arcana/swords/ten-swords",
    ]);
    expect(() => retrieveTarot("daily-card", ["inexistente"])).toThrow(/carta desconhecida/);
  });

  it("numerologia, Lua e sonhos", () => {
    expect(ids(retrieveNumerology([{ metric: "life-path", value: 11 }]))).toEqual([
      "numerology/calculations/life-path", "numerology/numbers/11", "numerology/methodology",
    ]);
    expect(ids(retrieveMoonToday("full-moon", "leo"))).toEqual(["moon/phases/full-moon", "moon/methodology", "astrology/signs/leo"]);
    expect(ids(retrieveDream(["water", "snake"]))).toEqual(["dreams/methodology", "dreams/symbols/water", "dreams/symbols/snake"]);
  });

  it("todo contexto cabe no orçamento e nenhum repete documento", () => {
    for (const ctx of [retrieveNatalSummary(A), retrieveLoveProfile(A), retrieveSynastry(synastry(A, B), A, B)]) {
      expect(size(ctx)).toBeLessThanOrEqual(DEFAULT_BUDGET_CHARS);
      expect(new Set(ids(ctx)).size).toBe(ctx.docs.length);
    }
  });

  it("regras editoriais disponíveis para o system prompt", () => {
    expect(editorialRules()).toMatch(/A IA interpreta dados/);
    expect(editorialRules()).toMatch(/Não prometer/);
  });
});

describe("extração de símbolos de sonho", () => {
  const slugs = (t: string) => extractDreamSymbols(t).map((s) => s.slug);

  it("reconhece termos em português, com e sem acento, na ordem do relato", () => {
    expect(slugs("Sonhei que estava num rio e uma cobra enorme apareceu")).toEqual(["water", "snake"]);
    expect(slugs("Eu estava caindo de um prédio e depois voando sobre o MAR")).toEqual(["falling", "flying", "ocean"]);
    expect(slugs("meus dentes caíram")).toEqual(["teeth"]);
    expect(slugs("Estava perdida num labirinto, sem saber onde ir")).toEqual(["lost"]);
  });

  it("não confunde palavras parecidas", () => {
    expect(slugs("marido")).toEqual([]); // "mar" não casa com "marido"
    expect(slugs("casamento")).toEqual([]); // "casa" não casa com "casamento"
    expect(slugs("um dia normal no trabalho")).toEqual([]);
  });
});
