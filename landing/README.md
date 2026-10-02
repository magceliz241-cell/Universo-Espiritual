# Landing do Astarot

Página de vendas estática (HTML, CSS e JS puros, sem build), publicada como um **segundo projeto na Vercel**, separado
do app.

| Arquivo | O que é |
|---|---|
| `index.html` | A página: hero com o mapa de exemplo e o cartão "O céu agora", céu ao vivo (Sol, Lua e planetas), problema, método, telas do app, Astarot Love, teste "Descubra por onde começar", oferta, garantia, FAQ |
| `config.js` | **Única coisa a editar:** link do checkout, endereço do app, e-mail, pixel e preços exibidos |
| `termos.html`, `privacidade.html` | Termos de Uso e Política de Privacidade (LGPD), com `legal.css` e `legal.js` |
| `assets.js` | **Gerado.** Posições do Sol, da Lua e dos planetas (set/2026 a dez/2030), instantes das Luas Nova e Cheia e a roda do mapa de exemplo, calculados com o mesmo motor do app (XALEN) |
| `sky.js` | Céu ao vivo: interpola as posições de `assets.js` para o segundo atual |
| `img/` | Telas do app (`app-*.webp`), imagens de clima (`amor-orbitas.webp` na seção do Astarot Love, `astrolabio.webp` no bloco do teste, `ceu-final.webp` no fechamento), imagem de compartilhamento (`og.jpg`) e ícone |
| `vercel.json` | URLs sem `.html`, cabeçalhos de segurança e cache das imagens |

## Antes de publicar

> No fluxo atual, quem preenche isto é o **Claude Code**, com os dados que o Cowork junta (Etapas 7 e 8 de
> `docs/HANDOFF_COWORK.md` e Passo 2 de `docs/RETORNO_CLAUDE_CODE.md`). Os passos abaixo valem se for feito à mão.

1. Em `config.js`, preencha:
   - `CHECKOUT_URL`: checkout da Cakto do **Astarot (R$ 19,90)**, com o order bump opcional do Astarot Love
     (+ R$ 10,00) dentro dele.
   - `CHECKOUT_LOVE_URL`: checkout próprio do produto **Astarot Love (R$ 29,90)**, que já inclui o Astarot.
   - `APP_URL`: endereço do app, sem barra no fim (aparece o link "Já comprei · Entrar").
   - `CONTACT_EMAIL`: e-mail de suporte (rodapé, FAQ, termos e privacidade).
   - `META_PIXEL_ID`: ID do pixel via UTMify **desta conta**. Vazio = nenhum pixel carrega.

   Enquanto um valor tiver `SEU-...`, a parte correspondente fica escondida e os botões de compra levam à seção de
   oferta. Nos termos e na privacidade aparece um aviso no lugar do e-mail.
2. **UTMify:** cole o script de captura de UTMs da sua conta no `<head>` do `index.html`, no comentário
   "UTMify - Script de captura de UTMs".
3. **Imagem de compartilhamento:** depois do primeiro deploy, troque em `index.html`
   `<meta property="og:image" content="img/og.jpg">` pelo endereço completo
   (ex.: `https://astarot.com.br/img/og.jpg`). WhatsApp e Facebook só leem endereço completo.
4. Confira se os preços em `config.js` batem com os da Cakto. A página só **exibe** o preço; quem cobra é a Cakto.

## Publicar na Vercel

✅ **Já publicada** em https://universo-espiritual-landing.vercel.app (projeto `universo-espiritual-landing`). Cada
merge na `main` atualiza o site sozinho. Os passos abaixo ficam como referência, caso seja preciso recriar o projeto.

1. *Add New → Project*, importe o mesmo repositório.
2. **Root Directory: `landing`**. Framework Preset: **Other**. Sem comando de build, sem variáveis de ambiente.
3. Deploy. Se quiser, conecte um domínio próprio.
4. No app (projeto principal da Vercel), preencha `NEXT_PUBLIC_LANDING_URL` com o endereço da landing e faça redeploy.

## Como a página funciona

- **Checkout:** "Quero o Astarot" vai para `CHECKOUT_URL`; os botões "Quero o Astarot Love" (cartão e seção do amor)
  vão para `CHECKOUT_LOVE_URL` (`utm_content=oferta-amor` ou `secao-amor`). Todos repassam as UTMs que vieram no link do
  anúncio. Quem termina o teste vai com `utm_content=quiz-<objetivo>` (`self`, `amor`, `momento`, `caminho`, `sonhos`).
- **Contador "por tempo limitado":** 32 minutos a partir da primeira visita naquele navegador (fica salvo no
  aparelho). Quando zera, o contador some e a página continua normal.
- **Céu ao vivo:** o cartão "O céu agora" (fase, posição e % iluminada da Lua, próxima Lua Nova ou Cheia) e a seção
  "O céu deste minuto" (Sol, Lua e os 8 planetas, com signo, grau e ℞ quando retrógrado, além de quando a Lua troca de
  signo) se atualizam a cada segundo, no horário do aparelho de quem visita. Não há servidor nem chamada ao app: o
  `assets.js` traz as posições calculadas pelo XALEN a cada 1 dia (Sol e Lua), 2 dias (Mercúrio, Vênus, Marte) e 5
  dias (Júpiter a Plutão), e o `sky.js` interpola para o instante atual. Erro máximo medido contra o motor: **1,4″**
  (`npm test` confere em 1.500 instantes aleatórios). Peso: cerca de 130 KB (40 KB comprimido).
- **Validade:** de 01/09/2026 a 31/12/2030. Fora disso, o cartão e a seção somem sozinhos. Para estender, mude as
  datas em `tests/landing/generate-assets.test.ts` e rode `npm run build:landing-assets`.
- **Teste "Descubra por onde começar":** 5 perguntas sobre interesse e rotina e uma sugestão de ponto de partida. As
  respostas ficam só no navegador. Os textos estão no fim do `index.html` (`QUIZ` e `R`). Link direto: `/#teste`.
- **Sem JavaScript,** todo o conteúdo continua visível.

## Manutenção

- **Regerar `assets.js`** (para estender o período do céu ao vivo ou mudar o mapa de exemplo):
  `npm run build:landing-assets` (gerador em `tests/landing/generate-assets.test.ts`).
- **Testar:** `npm run test:landing` abre a página no Chromium em 390 px e 1280 px e confere: rolagem horizontal,
  imagens, mapa, céu ao vivo (que ele anda com o relógio e some fora do período), contador, teste, links de checkout com UTMs, e-mail, páginas legais e a página sem JS. Também
  roda no CI.
- **Telas do app:** os `img/app-*.webp` vieram do ambiente de testes (o Guia aparece sem leitura porque a IA ainda
  não estava conectada). Quando o app estiver no ar com a IA real, vale trocar por capturas novas, com 780×1688 px.
- **Copy:** a página fala com quem acredita e quer o produto: sem avisos repetidos de "leitura simbólica" e sem
  chamar o Guia de IA (ele é apresentado como quem traduz o mapa para linguagem simples). A transparência legal fica
  nos Termos e na Privacidade, que continuam dizendo que as leituras são geradas por inteligência artificial. Limites
  que continuam valendo (`knowledge/LEGAL_AND_EDITORIAL_NOTES.md`): nenhuma promessa de resultado garantido (amor,
  dinheiro, saúde, "volta"), sem porcentagem de compatibilidade, linguagem neutra em gênero.
