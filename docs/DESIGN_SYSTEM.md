> **Atualização de 03/10/2026 (decisão do Guilherme): estética da capa Astarot.** Onde esta seção divergir do texto
> antigo abaixo, vale esta:
> - **Marca:** logo "ASTAROT" em maiúsculas clássicas (fonte Cinzel) com degradê dourado e uma estrela de quatro
>   pontas dentro do "O"; símbolo de estrela sobre lua crescente; lema "SEU MAPA. SEUS CICLOS. SEUS SINAIS."
>   (`src/components/brand/wordmark.tsx`).
> - **Fundo:** céu noturno roxo com estrelas pequenas e brilhos dourados (SVG leve, sem foto), sobre gradientes
>   roxos. Substitui a regra antiga "não usar imagem de galáxia" só no sentido de permitir estrelas desenhadas.
> - **Cores:** superfícies roxas (`#0a0714` → `#241c3c`), bordas em dourado translúcido, dourado com degradê
>   (`#f1d9a0` → `#d6b56e` → `#a8853f`) para marca, ícones e destaques; violeta continua nos botões principais.
> - **Cartões:** "vidro roxo" (`.surface-glass`) com borda dourada fina.
> - **Ícones:** traço fino dourado (sol, carta com losango, infinito, lua, lótus, estrela) em `shell/icons.tsx`.
> - **Início:** saudação "Olá, Nome ✦" com a Lua ao lado, faixa de fases da Lua, grade de atalhos 3×2 e cartão do
>   Seu Guia.
> - **Lua:** desenho realista (mares, crateras, textura), girado no hemisfério sul.
> - **Tarot:** arte original Rider-Waite-Smith (1909, domínio público) em traço dourado sobre roxo, com moldura
>   dourada e número romano; verso com estrela e lua douradas.
> - **Mapa:** roda em dourado sobre roxo; planetas em lista com ícone num círculo dourado ("Sol · em Leão · Casa 10").
> - Funcionalidades que aparecem na capa e não existem no app (Manifestação, Jornadas, Explorar, Histórico) **não**
>   foram criadas, por decisão do Guilherme.

# SEU UNIVERSO — DIREÇÃO DE ARTE & DESIGN SYSTEM

## 1. Visão da marca

### Conceito central

**Astarot — um observatório pessoal do universo.**

A interface deve transmitir:

- místico;
- celestial;
- sofisticado;
- contemporâneo;
- premium;
- acolhedor;
- tecnológico.

A estética deve parecer um **produto digital premium de astrologia**, não um template genérico de horóscopo.

### Regra principal

Comunicar espiritualidade por meio de:

- composição;
- tipografia;
- símbolos;
- círculos;
- órbitas;
- constelações;
- mapas;
- texturas sutis;
- microinterações.

Evitar depender de imagens místicas gigantes, excesso de estrelas ou efeitos chamativos.

---

# 2. O que EVITAR

Não usar como estética dominante:

- roxo neon;
- excesso de gradientes;
- excesso de dourado;
- fundos de galáxia fotográficos em todas as telas;
- estrelas aleatórias espalhadas pela interface;
- emojis como ícones principais;
- estética infantil;
- aparência de site de horóscopo antigo;
- excesso de elementos decorativos;
- visual de "bruxaria caricata";
- UI genérica de SaaS com apenas um tema roxo.

O produto deve parecer sofisticado mesmo quando visualizado sem nenhuma imagem.

---

# 3. Paleta de cores

## Background

```text
Background principal: #090812
Surface 1:             #12101D
Surface 2:             #181526
Surface 3:             #201C2D
```

## Texto

```text
Primary:   #F5F1EA
Secondary: #A7A2B5
Muted:     #777185
```

## Destaques

```text
Gold:      #D6B56E
Violet:    #8B72C9
Lilac:     #C58BCF
```

## Amor

Usar com moderação:

```text
Rose:      #C9829C
Wine:      #6D3D55
```

Não transformar a aplicação inteira em rosa na seção de amor.

---

# 4. Uso das cores

A cor dourada deve ser um **acento**, não a cor dominante.

Usar dourado para:

- graus importantes;
- elementos selecionados;
- pequenos detalhes;
- títulos especiais;
- indicadores;
- ícones de destaque.

Não usar dourado em todos os textos.

Violeta/lilás:

- estados ativos;
- elementos interativos;
- highlights;
- IA;
- componentes selecionados.

Background escuro:

- deve permanecer dominante.

---

# 5. Backgrounds

Não utilizar uma imagem de galáxia como background principal.

Construir o ambiente usando:

```text
background sólido escuro
+
radial gradients sutis
+
grain quase imperceptível
+
pequenos elementos celestiais
```

Exemplos:

- círculos orbitais;
- linhas finas;
- constelações discretas;
- lua;
- símbolos zodiacais;
- partículas pequenas.

Todos devem ter baixa opacidade.

---

# 6. Tipografia

## Display / títulos

Preferência:

1. Instrument Serif
2. Cormorant Garamond
3. DM Serif Display

Usar serif para:

- títulos principais;
- frases de interpretação;
- nomes de experiências;
- headlines.

## Interface

Preferência:

1. Inter
2. Geist

Usar sans-serif para:

- navegação;
- botões;
- labels;
- números;
- metadados;
- tabelas;
- configurações.

### Princípio

```text
ASTROLOGIA → serif elegante
TECNOLOGIA → sans-serif limpa
```

---

# 7. Logo / wordmark

Nome:

**Astarot**

Tratamento:

- serif elegante;
- peso regular/medium;
- espaçamento confortável;
- pequeno símbolo celestial opcional.

Não usar uma logo extremamente complexa.

O wordmark precisa funcionar também em:

- mobile;
- favicon;
- navbar;
- tela de login.

---

# 8. Ícones

Não utilizar emojis como ícones principais.

Criar/usar uma família de ícones consistente.

Estilo:

- line icon;
- linhas finas;
- cantos elegantes;
- aparência celestial.

Ícones importantes:

- Sol;
- Lua;
- planetas;
- signos;
- Tarot;
- numerologia;
- sonhos;
- amor;
- jornadas;
- perfil.

Os símbolos zodiacais podem usar glifos próprios, desde que visualmente consistentes.

---

# 9. Sistema de espaçamento

Usar uma escala consistente baseada em múltiplos de 4 ou 8.

Referência:

```text
4px
8px
12px
16px
24px
32px
48px
64px
96px
```

Não criar valores aleatórios para cada componente.

---

# 10. Bordas

Preferir:

```text
border-radius: 12px
```

Para cards maiores:

```text
16px
20px
24px
```

Evitar excesso de cards extremamente arredondados.

A interface deve parecer premium, não infantil.

---

# 11. Cards

Card padrão:

```text
background: #12101D
border: 1px rgba(255,255,255,0.06)
radius: 16px
```

Hover:

- mudança extremamente sutil de superfície;
- pequena elevação;
- brilho mínimo.

Não usar glow neon exagerado.

---

# 12. Dashboard

A primeira tela deve funcionar como um **observatório pessoal**.

Estrutura:

```text
┌──────────────────────────────────────────────┐
│ Astarot                         Perfil  │
│                                              │
│ Boa noite, [Nome]                            │
│                                              │
│ Seu céu hoje                                 │
│ ┌──────────────────────────────────────────┐ │
│ │              ☾                           │ │
│ │       FASE DA LUA                       │ │
│ │                                          │ │
│ │       [informação principal]             │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Seu mapa                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ ☉       │ │ ☾       │ │ ASC     │        │
│ │ Sol     │ │ Lua     │ │ ...     │        │
│ └─────────┘ └─────────┘ └─────────┘        │
│                                              │
│ Explorar                                     │
│ Tarot · Amor · Numerologia · Sonhos          │
│                                              │
│ ✦ Seu Guia                                   │
└──────────────────────────────────────────────┘
```

O dashboard deve parecer pessoal.

Evitar dashboard corporativo com dezenas de métricas.

---

# 13. Mapa Astral

O mapa astral é uma das principais peças visuais do produto.

Deve parecer:

> **um instrumento astronômico antigo reinterpretado como uma interface digital moderna.**

Características:

- círculos finos;
- divisões precisas;
- símbolos zodiacais;
- símbolos planetários;
- linhas de aspectos;
- graus;
- casas;
- pequenos detalhes dourados;
- fundo escuro;
- excelente legibilidade.

Evitar:

- mapa cheio de cores;
- linhas grossas;
- neon;
- excesso de informação sem hierarquia.

## Hierarquia

1. signos;
2. planetas;
3. Ascendente;
4. casas;
5. aspectos;
6. informações secundárias.

---

# 14. Seleção do sistema de casas

Padrão:

**Placidus**

Opções avançadas:

- Whole Sign;
- Equal.

A interface deve deixar Placidus pré-selecionado.

A opção deve aparecer em uma área discreta:

```text
Sistema de casas
● Placidus
○ Whole Sign
○ Equal
```

Não explicar astrologia inteira nesse momento.

---

# 15. Tela de interpretação do mapa

Estrutura:

```text
Seu mapa revela...

☉ Sol em [Signo]

[interpretação]

☾ Lua em [Signo]

[interpretação]

ASC Ascendente em [Signo]

[interpretação]
```

A IA deve transformar dados técnicos em linguagem natural.

Evitar paredes gigantes de texto.

Usar:

- resumo;
- tópicos;
- seções;
- insights;
- perguntas para reflexão.

---

# 16. Área de Amor

Visual:

- fundo escuro;
- pequenos tons vinho/rosa;
- dourado discreto;
- composição emocional;
- sem estética de aplicativo de namoro.

Exemplo:

```text
VOCÊ                         OUTRA PESSOA

☉ Sol                        ☉ Sol
☾ Lua                        ☾ Lua
♀ Vênus ─────────────────── ♀ Vênus
♂ Marte                     ♂ Marte

        CONEXÕES ENTRE OS MAPAS

        ☾ Lua × ☉ Sol
        ♀ Vênus × ♂ Marte
```

Não criar porcentagem arbitrária de compatibilidade.

Priorizar:

- conexões;
- aspectos;
- padrões;
- pontos de harmonia;
- pontos de tensão;
- interpretação contextual.

---

# 17. Tarot

O Tarot deve parecer uma experiência ritualística premium.

Cards:

- proporção vertical;
- imagem central;
- borda refinada;
- nome da carta;
- estado normal;
- estado selecionado.

Interação:

```text
Pergunta
↓
Escolha da tiragem
↓
Cartas fechadas
↓
Animação
↓
Carta revelada
↓
Interpretação
```

A IA interpreta.

O sistema faz o sorteio.

Nunca pedir à IA para sortear a carta.

---

# 18. Numerologia

Visual minimalista.

O número principal deve dominar a tela.

Exemplo:

```text
                    7

              CAMINHO DE VIDA

          introspecção · análise
             espiritualidade
```

Depois:

```text
┌────────────┐ ┌────────────┐ ┌────────────┐
│     3      │ │     7      │ │     5      │
│ EXPRESSÃO  │ │    ALMA    │ │PERSONALIDADE│
└────────────┘ └────────────┘ └────────────┘
```

Evitar transformar numerologia em tela cheia de símbolos.

---

# 19. Lua

A seção lunar pode ser uma das experiências mais bonitas.

Elementos:

- lua grande;
- fase atual;
- iluminação;
- data;
- nome da fase;
- intenção;
- diário;
- jornada.

Exemplo:

```text
                ◐

          QUARTO CRESCENTE

               67%

         28 DE SETEMBRO

            SUA INTENÇÃO

       [ Escreva sua intenção... ]
```

As mudanças de fase podem gerar pequenas alterações visuais.

---

# 20. Sonhos

A interface deve ser mais íntima e contemplativa.

Entrada:

```text
O que você sonhou?

[Conte seu sonho...]

Como você se sentiu?

○ Calmo
○ Ansioso
○ Feliz
○ Confuso
○ Outro
```

Resultado:

```text
Seu sonho pode estar relacionado a...

[tema]

Possíveis símbolos

[lista]

Uma leitura possível

[interpretação]

Para refletir

[pergunta]
```

Nunca apresentar uma interpretação como diagnóstico ou verdade absoluta.

---

# 21. IA — Seu Guia

A IA não deve parecer um chatbot genérico.

Nome da experiência:

**Seu Guia**

ou:

**✦ Seu Guia**

Entrada principal:

> **Pergunte ao seu mapa**

Sugestões:

- "Por que eu ajo assim nos relacionamentos?"
- "O que minha Lua representa?"
- "Quero entender minha vida amorosa."
- "O que meu mapa destaca neste momento?"
- "Quero interpretar meu sonho."

A resposta deve parecer uma consulta personalizada.

Não criar interface visualmente idêntica ao ChatGPT.

---

# 22. Microinterações

Usar animações pequenas e elegantes.

Exemplos:

- mapa aparecendo gradualmente;
- linhas orbitais se desenhando;
- carta de Tarot virando;
- lua com movimento extremamente sutil;
- hover nos signos;
- números aparecendo suavemente;
- pequenas transições entre páginas.

Evitar:

- partículas constantes;
- parallax exagerado;
- animações longas;
- efeitos de "magia" em tudo.

### Regra

A animação deve reforçar a experiência, não atrapalhar a leitura.

---

# 23. Motion

Duração aproximada:

```text
micro: 120–180ms
normal: 200–300ms
complexa: 400–700ms
```

Usar easing suave.

Respeitar:

```text
prefers-reduced-motion
```

---

# 24. Responsividade

Mobile é prioridade.

O mapa astral deve ser utilizável em telas pequenas.

Nunca simplesmente reduzir desktop até caber.

Criar versões específicas de:

- navegação;
- mapa;
- cards;
- Tarot;
- dashboard.

---

# 25. Mobile Navigation

Bottom navigation:

```text
┌────────────────────────────────────┐
│                                    │
│              CONTEÚDO              │
│                                    │
├────────────────────────────────────┤
│ Início │ Mapa │ (✦ Guia) │ Tarot │ Amor │
└────────────────────────────────────┘
```

Atualização 03/10/2026: o ✦ Guia fica no centro, num círculo dourado elevado acima da barra (mais destaque no
celular). Cada aba tem, no topo do conteúdo, "‹ voltar" (Início ou a seção-mãe) e um botão "?" pequeno com a dica
de uso daquela aba. As telas entram com um fade curto de baixo para cima (420 ms, desligado com reduced-motion).

O restante pode ficar em menu secundário.

---

# 26. IA + Design

Quando a IA produzir uma interpretação:

Não mostrar:

```text
Resposta da IA
```

Mostrar:

```text
✦ Seu Guia

Há algo interessante no seu mapa...

[conteúdo]
```

A IA deve parecer uma camada integrada ao produto.

---

# 27. Estados de carregamento

Não usar apenas:

> Loading...

Criar estados contextuais.

Mapa:

> **Observando seu céu...**

Tarot:

> **Preparando sua leitura...**

Numerologia:

> **Calculando seus números...**

Sonhos:

> **Organizando os símbolos do seu relato...**

Mas não fingir que existe processamento místico real. O texto é apenas UX.

---

# 28. Empty states

Exemplo:

```text
Ainda não criamos seu mapa.

Adicione seus dados de nascimento
para descobrir seu céu pessoal.

[ Criar meu mapa ]
```

Não usar empty states genéricos de SaaS.

---

# 29. Erros

Erros devem ser claros e humanos.

Exemplo:

> Não conseguimos calcular seu mapa com esses dados.
>
> Confira a data, horário e local de nascimento.

Nunca mostrar stack trace ao usuário.

---

# 30. Acessibilidade

Obrigatório:

- contraste adequado;
- foco visível;
- navegação por teclado;
- labels;
- aria quando necessário;
- `prefers-reduced-motion`;
- não depender somente de cor para comunicar informação.

O visual místico não pode comprometer acessibilidade.

---

# 31. Imagens

Evitar imagens externas sem licença.

Para Tarot e elementos visuais:

- usar assets próprios;
- usar assets com licença compatível;
- ou gerar/produzir ilustrações próprias.

Não copiar imagens de sites de terceiros.

---

# 32. Sistema de componentes

Criar componentes reutilizáveis.

Exemplo:

```text
components/
├── ui/
│   ├── Button
│   ├── Card
│   ├── Badge
│   ├── Dialog
│   ├── Tabs
│   └── Input
│
├── celestial/
│   ├── ZodiacIcon
│   ├── PlanetIcon
│   ├── MoonPhase
│   ├── OrbitalDecoration
│   └── Constellation
│
├── astrology/
│   ├── BirthChart
│   ├── ChartWheel
│   ├── PlanetPosition
│   ├── AspectLine
│   └── HouseTable
│
├── tarot/
│   ├── TarotCard
│   ├── TarotDeck
│   └── TarotSpread
│
└── ai/
    ├── GuideCard
    ├── Insight
    └── SuggestedQuestion
```

Não duplicar estilos entre páginas.

---

# 33. Design Tokens

Centralizar tokens.

Exemplo:

```ts
colors = {
  background,
  surface,
  surfaceElevated,
  textPrimary,
  textSecondary,
  textMuted,
  gold,
  violet,
  lilac,
  rose,
  wine
}
```

Espaçamento, radius, typography e motion também devem ser tokens.

---

# 34. Regra de ouro visual

Antes de adicionar qualquer elemento, perguntar:

> Isso ajuda o usuário a entender ou sentir a experiência?

Se não:

**remover.**

---

# 35. Personalidade

O Astarot deve transmitir:

> "Isso foi feito especialmente para mim."

Não:

> "Estou usando um software de astrologia."

A diferença está em:

- personalização;
- linguagem;
- espaço;
- animações;
- dados pessoais;
- interpretação;
- visual refinado.

---

# 36. Referência de atmosfera

A combinação desejada é:

```text
Astrologia tradicional
        +
Editorial premium
        +
Tecnologia moderna
        +
Interface minimalista
        +
Atmosfera celestial
```

Não copiar o design de nenhuma marca específica.

---

# 37. Critério de aprovação visual

Antes de considerar uma tela pronta, verificar:

- Parece um produto de astrologia?
- Parece premium?
- É legível?
- É elegante sem ser exagerado?
- Funciona em mobile?
- A hierarquia visual está clara?
- A espiritualidade aparece sem virar caricatura?
- A IA parece parte do produto?
- Há consistência com as demais telas?
- Existe excesso de decoração?

Se qualquer resposta for negativa, revisar.

---

# 38. Diretriz para Claude Code

Este documento é uma especificação visual do produto.

Ao implementar:

1. Leia este arquivo antes de criar componentes.
2. Não introduza uma nova paleta sem aprovação.
3. Não trocar tipografia sem aprovação.
4. Não criar páginas com estética genérica de SaaS.
5. Não usar emojis como ícones principais.
6. Não exagerar em estrelas, galáxias ou glow.
7. Reutilizar os componentes do Design System.
8. Garantir mobile.
9. Garantir acessibilidade.
10. Manter consistência entre todas as experiências.

Se houver conflito entre estética e usabilidade, **usabilidade vence**.

Se houver dúvida sobre uma decisão visual importante, apresentar 2 opções antes de implementar.
