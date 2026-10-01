# SEU UNIVERSO — MASTER BUILD PROMPT v2

Você é o engenheiro principal responsável por construir o produto **Seu Universo** usando Claude Code.

Este arquivo é a instrução mestre. Leia também integralmente:
- `knowledge/README.md`
- `knowledge/METHODOLOGIES.md`
- `knowledge/SOURCES.md`
- `knowledge/LEGAL_AND_EDITORIAL_NOTES.md`
- `knowledge/AI_CONTEXT_RULES.md`
- `knowledge/XALEN_INTEGRATION.md`

## 0. REGRA MAIS IMPORTANTE

NÃO comece codando imediatamente.

Primeiro faça auditoria do projeto e da Knowledge Base.

Execute inicialmente SOMENTE:
1. leitura dos documentos;
2. inspeção do repositório;
3. auditoria de stack;
4. auditoria de dependências/licenças;
5. auditoria de integração XALEN;
6. plano técnico por fases.

Depois apresente o relatório e aguarde autorização para implementar.

Não invente APIs, pacotes, versões ou licenças.

---

# 1. PRODUTO

Construir uma plataforma de acesso imediato de espiritualidade/esoterismo com área de membros.

Experiência central:
- perfil pessoal;
- mapa astral;
- perfil amoroso;
- mapa do casal/sinastria;
- Tarot;
- numerologia;
- Lua;
- sonhos;
- manifestação;
- gratidão/intenção;
- jornadas;
- assistente de IA.

A plataforma deve parecer uma **caixa de ferramentas personalizada**, não uma biblioteca de ebooks.

---

# 2. STACK

Já existente/preferencial:
- Next.js
- TypeScript
- Vercel
- Supabase
- Supabase Auth
- PostgreSQL
- Storage quando necessário
- pgvector somente se realmente necessário
- Groq como único provedor de IA no MVP
- GPT-OSS 120B como modelo inicial

Não adicionar:
- OpenRouter
- Gemini
- segundo provedor de IA
- Kubernetes
- microserviços sem necessidade
- infraestrutura complexa.

---

# 3. IA

Provedor:
`Groq`

Modelo:
`openai/gpt-oss-120b`

Variável:
`GROQ_MODEL=openai/gpt-oss-120b`

A chamada à IA deve ser centralizada em:
`src/lib/ai/`

Sugestão:
```text
src/lib/ai/
  groq.ts
  prompts.ts
  context-builder.ts
  response-parser.ts
  cache.ts
  usage.ts
```

A IA faz:
- interpretação;
- síntese;
- personalização;
- redação;
- conversa.

A IA NÃO faz:
- cálculo astronômico;
- cálculo numerológico;
- sorteio de Tarot;
- cálculo de fases;
- cálculo de aspectos;
- cálculo de casas.

---

# 4. MOTOR ASTRONÔMICO — XALEN

Usar **XALEN Ephemeris**.

NÃO usar Swiss Ephemeris.

Fonte oficial:
https://github.com/vedika-io/xalen-ephemeris

A documentação atual do XALEN declara Apache-2.0 e informa que:
- o core é Rust;
- há bindings Node/WASM;
- os bindings podem precisar ser compilados do source;
- crates publicados e código do repositório podem estar em versões diferentes;
- há 23 sistemas de casas;
- há Ascendente/MC;
- há aspectos;
- há nós, Chiron e Lilith;
- há VSOP87A/ELP2000-82;
- há leitor DE440;
- há validações contra JPL DE440 e referências astrológicas.

NÃO assumir que `npm install xalen` funcione. Verificar a documentação/release atual.

---

# 5. INTERFACE DO MOTOR

Criar abstração:

```ts
interface EphemerisEngine {
  calculateChart(
    input: BirthData,
    options: ChartOptions
  ): Promise<BirthChart>;
}
```

Implementação:
`XalenEphemerisEngine`

O restante do app nunca deve depender diretamente dos internals do XALEN.

---

# 6. EXECUÇÃO DO XALEN

Investigar primeiro:
1. WASM;
2. Node native binding;
3. Rust separado;
4. serviço persistente apenas se necessário.

Escolher a opção mais simples que funcione bem na Vercel.

Não criar microserviço antecipadamente.

Se DE440 for utilizado, não baixar 32 MB a cada request.

O caminho inicial deve preferir o motor analítico sem dados externos se sua precisão for suficiente.

---

# 7. LICENÇA

Antes de integrar:
- registrar versão/commit do XALEN;
- preservar licença/NOTICE quando necessário;
- auditar dependências;
- auditar dados/catálogos.

Não adicionar Swiss Ephemeris.

Se houver dúvida sobre licença:
PARAR e reportar.

---

# 8. DADOS DE NASCIMENTO

Input:

```ts
{
  date: "YYYY-MM-DD",
  time: "HH:mm:ss",
  timezone: "America/Sao_Paulo",
  latitude: number,
  longitude: number
}
```

Timezone deve ser tratado explicitamente.

Nunca interpretar horário local como UTC sem conversão.

Validar tudo no backend.

---

# 9. MAPA ASTRAL

MVP:

Planetas:
- Sun
- Moon
- Mercury
- Venus
- Mars
- Jupiter
- Saturn
- Uranus
- Neptune
- Pluto

Pontos opcionais:
- Ascendant
- MC
- Mean Node
- True Node
- Chiron
- Lilith

Zodíaco:
- tropical
- 12 signos
- 30° cada

Casas:
- Placidus como padrão inicial, desde que o teste de integração XALEN confirme suporte adequado.
- `house_system` obrigatório e versionado.

Aspectos:
- conjunction
- sextile
- square
- trine
- opposition

Orbs configuráveis.

---

# 10. JSON DO MAPA

Exemplo:

```json
{
  "engine": {
    "name": "xalen",
    "version": "FIXED_VERSION_OR_COMMIT",
    "method": "analytical"
  },
  "zodiac": "tropical",
  "house_system": "placidus",
  "birth_data": {},
  "planets": {
    "sun": {
      "longitude": 142.51234,
      "sign": "leo",
      "degree": 22,
      "minute": 30,
      "second": 44,
      "retrograde": false
    }
  },
  "angles": {},
  "houses": [],
  "aspects": []
}
```

Nunca armazenar somente texto gerado pela IA.

---

# 11. SINASTRIA

Calcular:
- mapa A;
- mapa B;
- aspectos cruzados A→B;
- casas/posições relevantes;
- interpretação.

Não criar um "score de compatibilidade" arbitrário.

Se futuramente existir score, definir metodologia explícita e versionada.

---

# 12. NUMEROLOGIA

Método:
Pitagórico.

Implementar métricas com versão:
- Life Path / Caminho de Vida;
- Expression/Destiny;
- Soul Urge;
- Personality;
- Birthday;
- Personal Year;
- números mestres 11/22/33 conforme regra da métrica.

Toda fórmula deve ser determinística.

Não misturar Chaldean com Pythagorean.

---

# 13. TAROT

78 cartas RWS.

O sistema:
1. recebe pergunta;
2. escolhe tiragem;
3. sorteia usando RNG do runtime;
4. define orientação se habilitada;
5. monta contexto da carta;
6. IA interpreta.

A IA NÃO sorteia.

---

# 14. LUA

O software determina:
- fase;
- iluminação;
- data/hora de fase;
- posição quando necessário.

A KB fornece:
- simbolismo;
- práticas;
- reflexão.

Não apresentar simbolismo como causalidade científica.

---

# 15. SONHOS

Usuário descreve sonho.

Pipeline:
```text
texto do usuário
→ extrair temas/símbolos
→ recuperar KB relevante
→ considerar emoções/contexto fornecido
→ IA gerar interpretação reflexiva
```

Nunca diagnosticar.

Nunca afirmar significado universal.

---

# 16. KNOWLEDGE RETRIEVAL

Não enviar a KB inteira para a IA.

Criar contexto por tarefa.

Exemplo:
`love_profile`:
- dados amorosos do mapa;
- signos relevantes;
- Venus/Mars;
- casas relevantes;
- aspectos relevantes;
- apenas os documentos necessários.

Exemplo:
`dream_analysis`:
- símbolos identificados;
- entradas dos símbolos;
- perguntas reflexivas;
- contexto emocional fornecido.

O sistema deve trabalhar com IDs/caminhos de documentos e metadados.

---

# 17. SUPABASE

Criar/avaliar tabelas para:
- profiles
- birth_profiles
- birth_charts
- tarot_readings
- numerology_profiles
- moon_journeys
- dream_entries
- ai_generations
- usage_events

`birth_charts` deve guardar:
- input normalizado;
- timezone;
- coordenadas;
- engine;
- engine version;
- method;
- zodiac;
- house system;
- chart JSON;
- timestamps.

Adicionar hash de input para cache/deduplicação.

---

# 18. CACHE

O mesmo input deve produzir o mesmo mapa.

Hash:
- data;
- hora;
- timezone;
- latitude;
- longitude;
- zodiac;
- house system;
- engine version;
- calculation method.

Não cachear resposta de IA como se fosse cálculo astronômico.

IA pode ter cache separado por:
- tarefa;
- input;
- prompt version;
- knowledge version;
- model.

---

# 19. BENCHMARK

Obrigatório antes de declarar o motor pronto.

Criar fixtures.

Testar:
- 50+ mapas;
- horários diferentes;
- latitudes/longitudes;
- mudança de signo;
- altas latitudes;
- DST;
- datas próximas a limites.

Comparar com referências JPL quando possível.

Medir:
- planetas;
- Lua;
- ASC;
- MC;
- casas;
- aspectos derivados.

Registrar tolerâncias.

Não usar Swiss Ephemeris como runtime. Se usado apenas como oracle de teste, documentar claramente a finalidade e verificar a licença do uso da ferramenta/dados no ambiente de desenvolvimento.

---

# 20. TESTES DE BORDA

Testar:
- 00:00;
- 23:59;
- mudança de data;
- DST;
- anos bissextos;
- 0°;
- 29°59';
- altas latitudes;
- coordenadas inválidas;
- timezone inválido;
- horário ausente;
- casas em condições polares.

---

# 21. UX DO MVP

Dashboard:
- resumo pessoal;
- Sol/Lua/Ascendente;
- acesso ao mapa;
- Tarot;
- numerologia;
- Lua;
- sonhos;
- jornadas.

Mapa:
- wheel;
- posições;
- casas;
- aspectos;
- explicações IA.

Amor:
- perfil amoroso;
- sinastria;
- Tarot do amor.

---

# 22. SEGURANÇA

Nunca expor:
- GROQ_API_KEY;
- service role key;
- secrets;
- dados privados de outros usuários.

RLS no Supabase.

Validar input no servidor.

IA não deve receber dados pessoais irrelevantes.

---

# 23. OBSERVABILIDADE

Registrar:
- feature;
- model;
- prompt version;
- knowledge version;
- tokens quando disponível;
- latency;
- erro;
- cache hit/miss.

Nunca registrar secrets.

---

# 24. ORDEM DE EXECUÇÃO

## FASE 0 — AUDITORIA
Não codar.
Entregar relatório.

## FASE 1 — XALEN POC
Instalar/buildar e calcular uma posição.

## FASE 2 — CHART ENGINE
Planetas + zodíaco + ASC + MC + casas.

## FASE 3 — ASPECTOS
Detector e testes.

## FASE 4 — SUPABASE
Persistência e cache.

## FASE 5 — KNOWLEDGE
Retrieval por tarefa.

## FASE 6 — IA
Groq + GPT-OSS 120B.

## FASE 7 — FEATURES
Mapa, amor, Tarot, numerologia, Lua, sonhos.

## FASE 8 — BENCHMARK
Precisão e edge cases.

## FASE 9 — POLIMENTO
UX, performance, segurança e deploy.

---

# 25. REGRA DE EXECUÇÃO DO CLAUDE CODE

Depois de cada fase:
1. rodar testes;
2. verificar build;
3. documentar alterações;
4. registrar decisões;
5. apontar riscos;
6. só então avançar.

Não apagar código existente sem entender sua função.

Não criar abstrações inúteis.

Não adicionar dependências sem justificar.

Não inventar dados.

Não inventar fontes.

Não inventar APIs do XALEN.

Não substituir XALEN silenciosamente.

Se algo não puder ser confirmado, pare e pergunte.

---

# 26. DEFINIÇÃO DE PRONTO

O MVP só será considerado pronto quando:

- XALEN calcula mapas;
- resultados são determinísticos;
- Supabase armazena mapas;
- Knowledge Retrieval funciona;
- Groq gera interpretações;
- IA não faz cálculos;
- Tarot usa RNG real;
- numerologia é determinística;
- testes passam;
- benchmark passa as tolerâncias definidas;
- licenças/dependências estão documentadas;
- Vercel deploya sem hacks frágeis;
- secrets não aparecem no client.

# PRIMEIRA AÇÃO

**NÃO IMPLEMENTE.**

Leia todos os arquivos de contexto e faça a auditoria.

Ao terminar, apresente:

1. arquitetura atual;
2. arquitetura proposta;
3. versão/commit do XALEN que pretende usar;
4. método de integração XALEN→Next.js;
5. dependências novas;
6. riscos;
7. questões de licença;
8. plano de fases;
9. arquivos que pretende criar/alterar.

Aguarde autorização para iniciar a FASE 1.
