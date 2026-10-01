# Landing do Seu Universo

Página de vendas estática (HTML, CSS e JS puros, sem build), publicada como um **segundo projeto na Vercel**, separado
do app.

| Arquivo | O que é |
|---|---|
| `index.html` | A página: hero com o mapa de exemplo e a Lua de hoje, problema, método, telas do app, Relacionamentos, teste "Descubra por onde começar", oferta, garantia, FAQ |
| `config.js` | **Única coisa a editar:** link do checkout, endereço do app, e-mail, pixel e preços exibidos |
| `termos.html`, `privacidade.html` | Termos de Uso e Política de Privacidade (LGPD), com `legal.css` e `legal.js` |
| `assets.js` | **Gerado.** Tabela da Lua (set/2026 a dez/2030), fases principais e a roda do mapa de exemplo, calculadas com o mesmo motor do app (XALEN) |
| `img/` | Telas do app (`app-*.webp`), imagem de compartilhamento (`og.jpg`) e ícone |
| `vercel.json` | URLs sem `.html`, cabeçalhos de segurança e cache das imagens |

## Antes de publicar

1. Em `config.js`, preencha:
   - `CHECKOUT_URL`: checkout da Cakto do **plano principal (R$ 19,90)**, com o order bump **Relacionamentos
     (R$ 9,90)** configurado dentro desse mesmo checkout.
   - `APP_URL`: endereço do app, sem barra no fim (aparece o link "Já comprei · Entrar").
   - `CONTACT_EMAIL`: e-mail de suporte (rodapé, FAQ, termos e privacidade).
   - `META_PIXEL_ID`: ID do pixel via UTMify **desta conta**. Vazio = nenhum pixel carrega.

   Enquanto um valor tiver `SEU-...`, a parte correspondente fica escondida e os botões de compra levam à seção de
   oferta. Nos termos e na privacidade aparece um aviso no lugar do e-mail.
2. **UTMify:** cole o script de captura de UTMs da sua conta no `<head>` do `index.html`, no comentário
   "UTMify - Script de captura de UTMs".
3. **Imagem de compartilhamento:** depois do primeiro deploy, troque em `index.html`
   `<meta property="og:image" content="img/og.jpg">` pelo endereço completo
   (ex.: `https://seuuniverso.com.br/img/og.jpg`). WhatsApp e Facebook só leem endereço completo.
4. Confira se os preços em `config.js` batem com os da Cakto. A página só **exibe** o preço; quem cobra é a Cakto.

## Publicar na Vercel

1. *Add New → Project*, importe o mesmo repositório.
2. **Root Directory: `landing`**. Framework Preset: **Other**. Sem comando de build, sem variáveis de ambiente.
3. Deploy. Se quiser, conecte um domínio próprio.
4. No app (projeto principal da Vercel), preencha `NEXT_PUBLIC_LANDING_URL` com o endereço da landing e faça redeploy.

## Como a página funciona

- **Checkout:** todo botão "Quero o meu acesso" vai para `CHECKOUT_URL`, repassando as UTMs que vieram no link do
  anúncio. Quem termina o teste vai com `utm_content=quiz-<objetivo>` (`self`, `amor`, `momento`, `caminho`, `sonhos`).
- **Contador "por tempo limitado":** 32 minutos a partir da primeira visita naquele navegador (fica salvo no
  aparelho). Quando zera, o contador some e a página continua normal.
- **Lua de hoje:** lida de `assets.js` pela data de Brasília. Fora do período da tabela, o cartão simplesmente não
  aparece.
- **Teste "Descubra por onde começar":** 5 perguntas sobre interesse e rotina e uma sugestão de ponto de partida. As
  respostas ficam só no navegador. Os textos estão no fim do `index.html` (`QUIZ` e `R`). Link direto: `/#teste`.
- **Sem JavaScript,** todo o conteúdo continua visível.

## Manutenção

- **Regerar `assets.js`** (para estender a tabela da Lua ou mudar o mapa de exemplo):
  `npm run build:landing-assets` (gerador em `tests/landing/generate-assets.test.ts`).
- **Testar:** `npm run test:landing` abre a página no Chromium em 390 px e 1280 px e confere: rolagem horizontal,
  imagens, mapa, Lua, contador, teste, links de checkout com UTMs, e-mail, páginas legais e a página sem JS. Também
  roda no CI.
- **Telas do app:** os `img/app-*.webp` vieram do ambiente de testes (o Guia aparece sem leitura porque a IA ainda
  não estava conectada). Quando o app estiver no ar com a IA real, vale trocar por capturas novas, com 780×1688 px.
- **Copy:** siga as regras de `knowledge/LEGAL_AND_EDITORIAL_NOTES.md`: sem promessa de resultado, sem porcentagem de
  compatibilidade, sem medo nem urgência espiritual, linguagem neutra em gênero.
