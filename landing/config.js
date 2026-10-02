/* ============================================================
   CONFIGURAÇÃO DA LANDING — troque só o que está aqui.
   Vale para index.html, termos.html e privacidade.html.
   Enquanto um valor tiver "SEU-...", a parte correspondente fica escondida
   ou o botão leva para a seção de planos.
   ============================================================ */
window.SU_CONFIG = {
  /* Checkout da Cakto do produto ASTAROT (R$ 19,90). É nele que fica o order bump opcional
     "Astarot Love" (+ R$ 10,00). */
  CHECKOUT_URL: "SEU-LINK-AQUI",

  /* Checkout da Cakto do produto ASTAROT LOVE (R$ 29,90): produto próprio, que já inclui o Astarot. */
  CHECKOUT_LOVE_URL: "SEU-LINK-LOVE-AQUI",

  /* Endereço do app (área de membros), para o link "Já comprei? Entrar". Sem barra no fim. */
  APP_URL: "SEU-APP-AQUI",

  /* E-mail de contato e suporte (aparece no rodapé, no FAQ, nos termos e na privacidade). */
  CONTACT_EMAIL: "SEU-EMAIL-AQUI",

  /* Pixel da Meta via UTMify (o mesmo tipo de ID do Calistenic, mas DESTA conta).
     Deixe vazio para não carregar o pixel. O script de captura de UTMs da UTMify é
     específico de cada conta: cole-o no <head> do index.html, no lugar indicado. */
  META_PIXEL_ID: "",

  /* Preços exibidos na página (o valor cobrado é sempre o da Cakto). */
  PRICE: "19,90",
  BUMP_PRICE: "10,00",   /* order bump do Love no checkout do Astarot */
  LOVE_PRICE: "29,90",   /* produto Astarot Love sozinho */
};
