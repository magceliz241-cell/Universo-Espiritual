# Astarot — Knowledge Base

Esta pasta contém a base editorial, metodológica e técnica usada pelo Astarot.

## Hierarquia de confiança

1. **Cálculo determinístico do software** — posições, casas, aspectos, números, fases e sorteios.
2. **Metodologia versionada** — define exatamente como cada cálculo/interpretação é feito.
3. **Knowledge Base** — fornece conteúdo interpretativo e editorial.
4. **IA** — sintetiza e personaliza; não inventa cálculos.

## Regra absoluta

A IA nunca deve calcular astrologia, numerologia, fases lunares ou sorteios de Tarot quando o software puder fazê-lo deterministicamente.

## Astrologia

O motor astronômico do produto é **XALEN Ephemeris**, executado localmente/self-hosted. Swiss Ephemeris não deve ser usado como dependência do produto.

O XALEN atualmente documenta núcleo Apache-2.0, bindings Node/WASM em desenvolvimento/alpha e múltiplos sistemas de casas, além de validação contra JPL DE440 e referências astrológicas. Consulte `XALEN_INTEGRATION.md` e `SOURCES.md`. A documentação oficial também informa que os pacotes Node/npm e WASM ainda precisam ser construídos a partir do repositório em vez de presumirmos que `npm install` já esteja disponível. 

## Conteúdo interpretativo

- Astrology: fundamentos, signos, planetas, casas, aspectos e sinastria.
- Numerology: método pitagórico versionado.
- Tarot: tradição Rider-Waite-Smith.
- Moon: astronomia das fases + prática simbólica.
- Dreams: interpretação reflexiva, nunca diagnóstico.

## Regras editoriais

Não copiar textos longos das fontes. A KB é uma síntese própria apoiada em referências.
Não apresentar astrologia, Tarot ou numerologia como ciência causal.
Não prometer resultados médicos, financeiros, jurídicos ou sobrenaturais.
