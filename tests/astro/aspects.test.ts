import { describe, expect, it } from "vitest";
import {
  ASPECT_CONFIG,
  type AspectBody,
  crossAspects,
  findAspect,
  maxOrb,
  natalAspects,
  SYNASTRY_CONFIG,
} from "@/lib/astro/aspects";
import { isKeyContact, synastry } from "@/lib/astro/synastry";
import { XalenEphemerisEngine } from "@/lib/astro/xalen-engine";

const body = (key: AspectBody["key"], longitude: number, speed: number | null = 1): AspectBody => ({ key, longitude, speed });

describe("orbes", () => {
  it("orbe base, bônus de luminar, teto de pontos e ângulos", () => {
    expect(maxOrb("square", "mars", "saturn", ASPECT_CONFIG)).toBe(7);
    expect(maxOrb("square", "sun", "saturn", ASPECT_CONFIG)).toBe(9);
    expect(maxOrb("conjunction", "moon", "true_node", ASPECT_CONFIG)).toBe(3);
    expect(maxOrb("trine", "sun", "ascendant", ASPECT_CONFIG)).toBe(5);
  });

  it("fronteira do orbe: 7° entra, 7,0001° não (quadratura Marte–Saturno)", () => {
    expect(findAspect(body("mars", 0), body("saturn", 97), ASPECT_CONFIG)?.type).toBe("square");
    expect(findAspect(body("mars", 0), body("saturn", 97.0001), ASPECT_CONFIG)).toBeNull();
  });
});

describe("detecção", () => {
  it("conjunção atravessando 0° (358° e 3°)", () => {
    const a = findAspect(body("venus", 358), body("mars", 3), ASPECT_CONFIG);
    expect(a).toMatchObject({ type: "conjunction", angle: 0 });
    expect(a!.orb).toBeCloseTo(5, 9);
  });

  it("oposição exata e trígono", () => {
    expect(findAspect(body("sun", 10), body("moon", 190), ASPECT_CONFIG)).toMatchObject({ type: "opposition", orb: 0 });
    expect(findAspect(body("jupiter", 100), body("saturn", 340), ASPECT_CONFIG)).toMatchObject({ type: "trine", orb: 0 });
  });

  it("sem aspecto entre 45° de distância", () => {
    expect(findAspect(body("mercury", 0), body("mars", 45), ASPECT_CONFIG)).toBeNull();
  });

  it("aplicativo × separativo pela velocidade", () => {
    // Lua (rápida) atrás de Vênus, se aproximando → aplicativa
    expect(findAspect(body("moon", 95, 13), body("venus", 100, 1), ASPECT_CONFIG)?.applying).toBe(true);
    // Lua à frente, se afastando → separativa
    expect(findAspect(body("moon", 105, 13), body("venus", 100, 1), ASPECT_CONFIG)?.applying).toBe(false);
    // ângulo não tem velocidade → null
    expect(findAspect(body("sun", 0, 1), body("ascendant", 2, null), ASPECT_CONFIG)?.applying).toBeNull();
  });

  it("natal ignora ângulo×ângulo e ponto×ponto e ordena por orbe", () => {
    const list = natalAspects([
      body("ascendant", 0, null), body("mc", 90, null),
      body("true_node", 10), body("chiron", 10),
      body("sun", 0.5), body("moon", 120.2),
    ]);
    expect(list.find((x) => x.a === "ascendant" && x.b === "mc")).toBeUndefined();
    expect(list.find((x) => x.a === "true_node" && x.b === "chiron")).toBeUndefined();
    for (let i = 1; i < list.length; i++) expect(list[i].orb).toBeGreaterThanOrEqual(list[i - 1].orb);
  });

  it("cruzado usa orbes de sinastria (mais apertados)", () => {
    expect(crossAspects([body("mars", 0)], [body("saturn", 96.5)], SYNASTRY_CONFIG)).toEqual([]);
    expect(crossAspects([body("mars", 0)], [body("saturn", 95)], SYNASTRY_CONFIG)).toHaveLength(1);
  });
});

describe("integração com o mapa e sinastria", () => {
  const engine = new XalenEphemerisEngine();
  const A = engine.calculateChartSync(
    { date: "1990-08-15", time: "14:30", timezone: "America/Sao_Paulo", latitude: -23.5505, longitude: -46.6333 },
    { houseSystem: "placidus" },
  );
  const B = engine.calculateChartSync(
    { date: "1992-03-02", time: "06:10", timezone: "America/Recife", latitude: -8.0476, longitude: -34.877 },
    { houseSystem: "placidus" },
  );

  it("o mapa traz aspectos consistentes com as longitudes", () => {
    expect(A.aspects.length).toBeGreaterThan(0);
    for (const asp of A.aspects) {
      expect(asp.orb).toBeLessThanOrEqual(maxOrb(asp.type, asp.a, asp.b, ASPECT_CONFIG) + 1e-12);
    }
  });

  it("sinastria sem score, com sobreposição de casas e contatos-chave", () => {
    const s = synastry(A, B);
    expect(s).not.toHaveProperty("score");
    expect(s.aspects.length).toBeGreaterThan(0);
    expect(Object.keys(s.overlays.a_in_b!)).toHaveLength(10);
    for (const h of Object.values(s.overlays.b_in_a!)) expect(h).toBeGreaterThanOrEqual(1);
    for (const asp of s.aspects) expect(asp.key_contact).toBe(isKeyContact(asp.a, asp.b));
  });

  it("sinastria com horário desconhecido não inventa casas", () => {
    const Bnt = engine.calculateChartSync(
      { date: "1992-03-02", time: null, timezone: "America/Recife", latitude: -8.0476, longitude: -34.877 },
      { houseSystem: "placidus" },
    );
    const s = synastry(A, Bnt);
    expect(s.overlays.a_in_b).toBeNull();
    expect(s.overlays.b_in_a).not.toBeNull();
    expect(s.aspects.every((x) => x.b !== "ascendant" && x.b !== "mc")).toBe(true);
  });

  it("contatos-chave: Vênus–Marte sim, Urano–Netuno não", () => {
    expect(isKeyContact("venus", "mars")).toBe(true);
    expect(isKeyContact("mars", "venus")).toBe(true);
    expect(isKeyContact("uranus", "neptune")).toBe(false);
  });
});
