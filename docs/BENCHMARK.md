# Benchmark de precisão — Seu Universo

> Gerado por `npm run benchmark`. Motor: XALEN commit `cc6edbec1f748ebdc4950ae6198f575c5ada73fa` via engine/ (su-ephem), modo analítico.
> As margens abaixo são **limites de aceitação do nosso benchmark**, não uma afirmação de precisão absoluta do XALEN.

## Política de fontes

| Camada | Fonte |
|---|---|
| Produção | XALEN (único motor no runtime) |
| Oráculo astronômico principal | JPL Horizons / DE440 (`scripts/fetch-jpl-fixtures.ts`, parâmetros registrados nas fixtures) |
| Casas/ASC/MC | Oráculo independente de fórmulas (`tests/benchmark/oracle/houses.ts`), com o tempo sideral do JPL quando as fixtures existem |
| Comparação secundária | Swiss Ephemeris: **não usada** neste relatório (só consulta externa manual, se necessário) |

## Planetas (longitude eclíptica aparente, de data)

Referência: **valores JPL citados em docs/ACCURACY.md do XALEN (segunda mão; fixtures JPL ainda não geradas)** · instantes: 2

> ⚠️ As fixtures próprias do JPL ainda não foram geradas (o ambiente de desenvolvimento bloqueou `ssd.jpl.nasa.gov`). Estes números usam valores citados pelo XALEN e **não** substituem o benchmark oficial.

| Corpo | n | máx | média | RMS | p95 | p99 | limite | resultado |
|---|---|---|---|---|---|---|---|---|
| sun | 2 | 0.48″ | 0.41″ | 0.42″ | 0.48″ | 0.48″ | ≤ 5″ | ✅ |
| moon | 2 | 0.97″ | 0.52″ | 0.69″ | 0.97″ | 0.97″ | ≤ 15″ | ✅ |
| mercury | 1 | 0.35″ | 0.35″ | 0.35″ | 0.35″ | 0.35″ | ≤ 5″ | ✅ |
| venus | 1 | 0.29″ | 0.29″ | 0.29″ | 0.29″ | 0.29″ | ≤ 5″ | ✅ |
| mars | 2 | 0.59″ | 0.46″ | 0.48″ | 0.59″ | 0.59″ | ≤ 5″ | ✅ |
| jupiter | 2 | 0.11″ | 0.09″ | 0.10″ | 0.11″ | 0.11″ | ≤ 5″ | ✅ |
| saturn | 1 | 0.13″ | 0.13″ | 0.13″ | 0.13″ | 0.13″ | ≤ 5″ | ✅ |
| uranus | 1 | 0.52″ | 0.52″ | 0.52″ | 0.52″ | 0.52″ | ≤ 5″ | ✅ |
| neptune | 1 | 1.07″ | 1.07″ | 1.07″ | 1.07″ | 1.07″ | ≤ 5″ | ✅ |

## Casas, Ascendente e Meio do Céu (Placidus)

Referência: oráculo independente (IAU 1982 GMST + nutação Meeus cap. 22 + obliquidade verdadeira; Placidus por semiarcos)

| Conjunto | Grandeza | n | máx | média | RMS | p95 | p99 | limite | resultado |
|---|---|---|---|---|---|---|---|---|---|
| 60 casos · lat ≤ 60° (abs.) | ASC | 50 | 0.00006° | 0.00002° | 0.00003° | 0.00005° | 0.00006° | ≤ 0.01° | ✅ |
| 60 casos · lat ≤ 60° (abs.) | MC | 50 | 0.00006° | 0.00002° | 0.00003° | 0.00005° | 0.00006° | ≤ 0.01° | ✅ |
| 60 casos · lat ≤ 60° (abs.) | cúspides | 600 | 0.00006° | 0.00002° | 0.00003° | 0.00005° | 0.00006° | ≤ 0.02° | ✅ |
| 60 casos · 60°–66° | ASC | 6 | 0.00014° | 0.00005° | 0.00007° | 0.00014° | 0.00014° | ≤ 0.01° | ✅ |
| 60 casos · 60°–66° | MC | 6 | 0.00004° | 0.00002° | 0.00003° | 0.00004° | 0.00004° | ≤ 0.01° | ✅ |
| 60 casos · 60°–66° | cúspides | 72 | 0.00014° | 0.00003° | 0.00005° | 0.00012° | 0.00014° | ≤ 0.02° | ✅ |
| grade 3000 · lat ≤ 60° (abs.) | ASC | 3000 | 0.00022° | 0.00003° | 0.00003° | 0.00006° | 0.00009° | ≤ 0.01° | ✅ |
| grade 3000 · lat ≤ 60° (abs.) | MC | 3000 | 0.00008° | 0.00003° | 0.00003° | 0.00006° | 0.00007° | ≤ 0.01° | ✅ |
| grade 3000 · lat ≤ 60° (abs.) | cúspides | 36000 | 0.00022° | 0.00003° | 0.00003° | 0.00006° | 0.00007° | ≤ 0.02° | ✅ |
| grade 3000 · 60°–66° | ASC | 3000 | 0.00108° | 0.00004° | 0.00007° | 0.00014° | 0.00031° | ≤ 0.01° | ✅ |
| grade 3000 · 60°–66° | MC | 3000 | 0.00009° | 0.00003° | 0.00003° | 0.00006° | 0.00007° | ≤ 0.01° | ✅ |
| grade 3000 · 60°–66° | cúspides | 36000 | 0.00108° | 0.00003° | 0.00005° | 0.00008° | 0.00016° | ≤ 0.02° | ✅ |
| polares (> 66,5°, fallback) | ASC | 504 | 0.00071° | 0.00002° | 0.00005° | 0.00007° | 0.00013° | ≤ 0.01° | ✅ |
| polares (> 66,5°, fallback) | MC | 504 | 0.00008° | 0.00003° | 0.00003° | 0.00005° | 0.00007° | ≤ 0.01° | ✅ |

## Pendências

- Gerar as fixtures do JPL Horizons (`node scripts/fetch-jpl-fixtures.ts`) num ambiente com acesso a `ssd.jpl.nasa.gov` e rodar `npm run benchmark` de novo.
- Plutão ≤ 5″ e teste apertado da Lua exigem o modo DE440 (kernel `de440s.bsp` só no ambiente de benchmark, nunca no runtime da Vercel).
- Antes de usar as fixtures, conferir na documentação do Horizons a definição exata das quantidades 7 e 31.
