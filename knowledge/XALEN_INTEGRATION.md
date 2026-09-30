# XALEN — Integração Técnica e Política de Uso

## Decisão

O Seu Universo utilizará **XALEN Ephemeris** como motor astronômico/astrológico local.

Repositório oficial:
https://github.com/vedika-io/xalen-ephemeris

## Por que

A documentação atual do XALEN declara:
- núcleo Apache-2.0;
- pure Rust;
- zero `unsafe` nos crates core;
- thread-safe;
- WASM-compatible;
- bindings para Node.js, Python, WASM e C;
- 23 sistemas de casas;
- cálculo de Ascendente/MC;
- aspectos;
- nós lunares;
- Chiron/Lilith;
- suporte analítico VSOP87A/ELP2000-82;
- leitor JPL DE440.

## IMPORTANTE SOBRE VERSÕES

A documentação atual informa que o código/repositório é mais avançado que os pacotes publicados:
- crates.io tem linha publicada 0.3.1;
- 0.4.x/0.5.x/0.6.x descritos no README ainda podem exigir dependência Git/path;
- npm/PyPI dos bindings não devem ser presumidos como publicados;
- Node e WASM podem precisar ser compilados a partir do source.

Portanto o Claude Code deve:
1. ler o README atual;
2. identificar o commit/tag utilizado;
3. fixar uma versão/commit;
4. registrar essa versão;
5. não instalar um pacote chamado `xalen` cegamente sem verificar se é o pacote correto.

## Licença

O README do projeto declara Apache License 2.0 para o XALEN.

Isso NÃO significa que todo dado externo distribuído pelo projeto seja automaticamente liberado sob Apache-2.0. O `NOTICE` do XALEN identifica componentes/fontes como NASA/JPL DE440, IAU, Hipparcos/ESA, IAU Star Names etc. Qualquer catálogo/dado adicional que seja redistribuído deve ser auditado separadamente.

Para o MVP, preferir:
- motor analítico compilado no XALEN;
- ou DE440 quando necessário e juridicamente/tecnicamente validado.

Não incorporar Swiss Ephemeris no produto.

## Precisão

A documentação do XALEN relata validações contra JPL DE440 e Swiss Ephemeris. Os números publicados incluem, para o caminho analítico, aproximadamente:
- Sol: 0,21 arcsec vs DE440 em teste estatístico;
- Mercúrio–Saturno: até ~0,76 arcsec;
- Urano: ~1,78 arcsec;
- Netuno: ~2,53 arcsec;
- Lua: RMS ~2,8 arcsec / máximo ~12 arcsec em AD 1600–2100 contra pyswisseph;
- DE440: sub-arcsecond para corpos suportados quando o kernel está disponível.

Esses são números publicados pelo projeto, não uma garantia independente nossa. O Seu Universo deve executar seus próprios testes de aceitação.

## DE440

O XALEN documenta um `de440s.bsp` opcional e um recurso `kernel-autodownload` que baixa aproximadamente 32 MB do NASA NAIF na primeira execução e mantém cache local.

Para Vercel/serverless:
- não assumir que cache persistente existe;
- não baixar o kernel a cada request;
- avaliar WASM/analítico ou serviço persistente;
- medir cold start e tamanho do bundle.

A primeira versão do produto deve funcionar sem depender de download de 32 MB por request.

## Arquitetura obrigatória

```text
Next.js / API
      |
      v
AstrologyService
      |
      v
EphemerisEngine interface
      |
      v
XalenEphemerisEngine
      |
      +--> planetary positions
      +--> Ascendant / MC
      +--> houses
      +--> aspects
      |
      v
StructuredChart JSON
      |
      v
Knowledge Retrieval
      |
      v
Groq / GPT-OSS
```

## Interface

Criar algo equivalente a:

```ts
interface EphemerisEngine {
  calculateChart(input: BirthData, options: ChartOptions): Promise<BirthChart>;
}
```

O restante do app não deve importar internals do XALEN.

## Estratégia de execução

Antes de escolher entre:
- Rust nativo;
- Node napi-rs;
- WASM;
- serviço separado;

o Claude Code deve testar a opção mais simples compatível com Vercel.

Prioridade:
1. WASM se desempenho/tamanho forem aceitáveis;
2. Node native binding se compatível com runtime/deploy;
3. serviço persistente somente se realmente necessário.

Não criar microserviço por antecipação.

## Benchmark obrigatório

Criar fixtures com:
- datas modernas;
- horários variados;
- latitudes/longitudes variadas;
- casos próximos a mudança de signo;
- latitudes altas;
- casos de horário de verão.

Comparar:
- posições planetárias;
- Ascendente;
- MC;
- cúspides;
- aspectos derivados.

O benchmark de aceitação deve ter tolerâncias explícitas em arcseconds/degrees.

## Regra de segurança

Se uma API, pacote, licença ou documentação não puder ser confirmada:
- não inventar;
- não substituir silenciosamente;
- registrar a dúvida;
- parar a fase afetada e reportar.

## Fontes técnicas

Ver `SOURCES.md` e `LEGAL_AND_EDITORIAL_NOTES.md`.
