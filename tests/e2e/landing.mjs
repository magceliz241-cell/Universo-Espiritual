// Teste da landing estática (landing/): npm run test:landing
// Sobe um servidor estático próprio; LANDING_URL=<url> testa um endereço já publicado.
// SHOTS=<pasta> salva capturas de tela.
import { chromium } from "playwright";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../../landing");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".json": "application/json" };
let server = null;
let BASE = (process.env.LANDING_URL || "").replace(/\/$/, "");
if (!BASE) {
  server = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  BASE = `http://127.0.0.1:${server.address().port}`;
}
const SHOTS = process.env.SHOTS || "";
const CHECKOUT = "https://pay.cakto.com.br/teste123";
const executablePath = fs.existsSync("/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
  ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
  : undefined;

let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${extra ? " — " + extra : ""}`);
  if (!ok) failed++;
};

const browser = await chromium.launch({ executablePath });

async function open(viewport, { config, query = "", page: file = "index.html" } = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: "pt-BR", timezoneId: "America/Sao_Paulo" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  // Fontes externas podem estar bloqueadas no ambiente de teste: não contam como erro da página.
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  page.on("requestfailed", () => {});
  if (config) {
    await page.route("**/config.js", (r) =>
      r.fulfill({ contentType: "application/javascript", body: `window.SU_CONFIG=${JSON.stringify(config)};` }));
  }
  await page.goto(`${BASE}/${file}${query}`, { waitUntil: "load" });
  return { ctx, page, errors: () => errors.filter((e) => !/fonts\.g|ERR_FAILED|net::/.test(e)) };
}

async function noOverflow(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}

async function revealAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
  });
}

for (const [label, viewport] of [["celular", { width: 390, height: 844 }], ["desktop", { width: 1280, height: 860 }]]) {
  // 1) Página com config padrão (placeholders): nada quebra, links caem na oferta.
  const { ctx, page, errors } = await open(viewport);
  await revealAll(page);
  check(`[${label}] sem rolagem horizontal`, await noOverflow(page));
  check(`[${label}] roda do mapa renderizada`, await page.locator("#wheel svg").count() === 1);
  const sky = await page.locator(".js-sky-detail").textContent();
  check(`[${label}] cartão da Lua de hoje preenchido`, await page.locator("#skyCard").isVisible() && /% iluminada · Lua em /.test(sky), sky);
  check(`[${label}] contador rodando`, /^(3[0-2]|[0-2]\d):\d\d$/.test(await page.locator(".topbar .js-timer").textContent()));
  check(`[${label}] checkout sem link cai na oferta`, await page.locator(".js-checkout").first().getAttribute("href") === "#oferta");
  check(`[${label}] e-mail placeholder escondido`, !(await page.locator("footer .js-email-wrap").isVisible()));
  check(`[${label}] link "Entrar" escondido sem APP_URL`, !(await page.locator(".js-app-link").isVisible()));
  const imgsOk = await page.evaluate(() => Promise.all([...document.images].map((i) => {
    i.loading = "eager";
    return i.complete ? i.naturalWidth > 0 : new Promise((r) => { i.onload = () => r(true); i.onerror = () => r(false); });
  })).then((a) => a.every(Boolean)));
  check(`[${label}] todas as imagens carregaram`, imgsOk);
  if (SHOTS) {
    fs.mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: path.join(SHOTS, `landing-${label}.png`), fullPage: true });
    await page.screenshot({ path: path.join(SHOTS, `landing-${label}-hero.png`) });
  }

  // 2) Quiz completo
  await page.locator(".hero .js-quiz").click();
  check(`[${label}] quiz abre na 1ª pergunta`, await page.locator(".q-title").textContent() === "O que você mais quer entender agora?");
  await page.locator(".q-opt", { hasText: "Meus relacionamentos" }).click();
  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(350);
    await page.locator(".q-opt").first().click();
  }
  await page.locator(".r-title").waitFor({ timeout: 4000 });
  check(`[${label}] resultado do quiz (amor)`, /perfil amoroso/.test(await page.locator(".r-title").textContent()));
  check(`[${label}] resultado destaca Relacionamentos`, await page.locator(".r-love").isVisible());
  check(`[${label}] quiz sem rolagem horizontal`, await noOverflow(page));
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `landing-${label}-quiz.png`) });
  await page.locator("#qOffer").click();
  check(`[${label}] "ver tudo" fecha o quiz`, !(await page.locator("#quizBox").isVisible()));
  check(`[${label}] sem erros no console`, errors().length === 0, errors().join(" | "));
  await ctx.close();

  // 3) Config preenchida + UTMs da URL repassadas ao checkout
  const cfg = { CHECKOUT_URL: CHECKOUT, APP_URL: "https://app.exemplo.com", CONTACT_EMAIL: "contato@exemplo.com", META_PIXEL_ID: "", PRICE: "19,90", BUMP_PRICE: "9,90" };
  const b = await open(viewport, { config: cfg, query: "?utm_source=fb&utm_campaign=lanc" });
  const href = new URL(await b.page.locator(".js-checkout").first().getAttribute("href"));
  check(`[${label}] checkout usa CHECKOUT_URL`, href.origin + href.pathname === CHECKOUT);
  check(`[${label}] checkout mantém UTMs`, href.searchParams.get("utm_source") === "fb" && href.searchParams.get("utm_campaign") === "lanc");
  check(`[${label}] e-mail de contato aparece`, await b.page.locator("footer .js-email").textContent() === "contato@exemplo.com");
  check(`[${label}] link "Entrar" aponta para o app`, await b.page.locator(".js-app-link").getAttribute("href") === "https://app.exemplo.com/auth/login");
  await b.page.locator(".hero .js-quiz").click();
  await b.page.locator(".q-opt", { hasText: "Meus sonhos" }).click();
  for (let i = 0; i < 4; i++) { await b.page.waitForTimeout(350); await b.page.locator(".q-opt").first().click(); }
  await b.page.locator("#qBuy").waitFor({ timeout: 4000 });
  const qh = new URL(await b.page.locator("#qBuy").getAttribute("href"));
  check(`[${label}] checkout do quiz marca utm_content`, qh.searchParams.get("utm_content") === "quiz-sonhos" && qh.searchParams.get("utm_source") === "fb");
  check(`[${label}] sem erros no console (config preenchida)`, b.errors().length === 0, b.errors().join(" | "));
  await b.ctx.close();

  // 4) Páginas legais
  for (const file of ["termos.html", "privacidade.html"]) {
    const l = await open(viewport, { page: file, config: cfg });
    check(`[${label}] ${file} sem rolagem horizontal`, await noOverflow(l.page));
    check(`[${label}] ${file} mostra o e-mail`, (await l.page.locator(".js-email").first().textContent()) === "contato@exemplo.com");
    check(`[${label}] ${file} sem erros`, l.errors().length === 0, l.errors().join(" | "));
    await l.ctx.close();
  }
}

// 5) Sem JavaScript tudo continua legível (nada fica escondido pelo efeito de revelar)
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.goto(`${BASE}/index.html`);
  const hidden = await page.evaluate(() => [...document.querySelectorAll(".reveal")].filter((e) => getComputedStyle(e).opacity === "0").length);
  check("[sem JS] conteúdo visível", hidden === 0, `${hidden} escondidos`);
  await ctx.close();
}

await browser.close();
server?.close();
console.log(failed ? `\n${failed} falha(s)` : "\nTudo certo");
process.exit(failed ? 1 : 0);
