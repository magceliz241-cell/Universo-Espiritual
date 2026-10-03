// Roteiro ponta a ponta (navegador real) contra o harness local.
// Uso: APP=http://localhost:3140 GATEWAY=http://127.0.0.1:54321 node tests/e2e/flow.mjs [pasta-de-screenshots]
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const APP = process.env.APP ?? "http://localhost:3140";
const GW = process.env.GATEWAY ?? "http://127.0.0.1:54321";
const SHOTS = process.argv[2] ?? null;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
};

async function outboxLink(email, type) {
  const r = await fetch(`${GW}/__outbox`);
  const list = (await r.json()).filter((m) => m.email === email && m.type === type);
  return list.at(-1)?.token_hash ?? null;
}

async function webhook(body) {
  const r = await fetch(`${APP}/api/webhooks/cakto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: "e2e-webhook-secret", ...body }),
  });
  return { status: r.status, body: await r.json() };
}

const purchase = (email, product, order) => ({
  event: "purchase_approved",
  data: { id: order, status: "paid", customer: { email }, product: { id: product } },
});

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const errors = [];
async function newPage(width) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !/favicon|_vercel/.test(m.text())) errors.push(`${page.url()}: ${m.text()}`);
  });
  return { ctx, page };
}
async function shot(page, name) {
  if (!SHOTS) return;
  await page.waitForTimeout(400);
  // Barras fixas viram estáticas para a captura de página inteira não repeti-las no meio.
  await page.addStyleTag({ content: "header.sticky,nav[aria-label='Navegação principal']{position:static!important}" }).catch(() => {});
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true });
}
/** Espera o elemento aparecer (a página chega em streaming por causa do loading.tsx). */
const visible = (locator, timeout = 10000) =>
  locator.first().waitFor({ state: "visible", timeout }).then(() => true, () => false);

async function noOverflow(page) {
  const r = await page.evaluate(() => {
    const ok = document.documentElement.scrollWidth <= window.innerWidth + 1;
    if (ok) return { ok, offenders: [] };
    const clipped = (el) => {
      for (let a = el.parentElement; a; a = a.parentElement) {
        const o = getComputedStyle(a).overflowX;
        if (o === "hidden" || o === "clip" || o === "auto" || o === "scroll") return true;
      }
      return false;
    };
    const offenders = [...document.querySelectorAll("body *")]
      .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1 && !clipped(e))
      .slice(0, 5)
      .map((e) => `${e.tagName} ${String(e.getAttribute("class") ?? "").slice(0, 60)} (${Math.round(e.getBoundingClientRect().right)}px) "${(e.textContent ?? "").slice(0, 40)}"`);
    return { ok, offenders };
  });
  if (!r.ok) console.log(`   ↳ ${page.url()}: ${r.offenders.join(" | ")}`);
  return r.ok;
}

const run = Date.now().toString(36);
const email = `ana-${run}@teste.seuuniverso`;
const password = "senha-segura-123";

try {
  const { page } = await newPage(390);

  // 1. Visitante é mandado para o login
  await page.goto(`${APP}/mapa`);
  check("visitante → login com next", page.url().includes("/auth/login?next=%2Fmapa"), page.url());
  await shot(page, "01-login");

  // 2. Cadastro
  await page.goto(`${APP}/auth/sign-up`);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.fill("#confirm", password);
  await page.click("button[type=submit]");
  await page.getByText("Enviamos um link de confirmação").waitFor({ timeout: 10000 });
  check("cadastro → confira seu e-mail", true);
  await shot(page, "02-signup-ok");

  // 3. Login antes de confirmar
  await page.goto(`${APP}/auth/login`);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click("button[type=submit]");
  await page.getByText("ainda não foi confirmado").waitFor({ timeout: 10000 });
  check("login sem confirmar avisa e oferece reenvio", await visible(page.getByText("Reenviar e-mail de confirmação")));

  // 4. Link inválido → erro amigável
  await page.goto(`${APP}/auth/confirm?token_hash=invalido&type=email&next=/`);
  check("link inválido → erro amigável", page.url().includes("/auth/error?reason=link"));

  // 5. Confirmação pelo link do e-mail (token_hash) → sem compra → /acesso
  const th = await outboxLink(email, "signup");
  await page.goto(`${APP}/auth/confirm?token_hash=${th}&type=email&next=/`);
  check("confirmação entra e, sem compra, vai para /acesso", page.url().endsWith("/acesso"), page.url());
  check("/acesso mostra o e-mail", await visible(page.getByText(email)));
  await shot(page, "03-acesso");

  // 6. Compra aprovada (webhook) libera na hora
  const w1 = await webhook(purchase(email, "prod-main-e2e", `ord-${run}-1`));
  check("webhook compra → processed", w1.status === 200 && w1.body.outcomes?.[0]?.status === "processed", JSON.stringify(w1.body));
  await page.goto(`${APP}/`);
  check("com compra → dashboard", page.url() === `${APP}/`, page.url());
  check("dashboard: estado vazio do mapa", await visible(page.getByText("Ainda não criamos seu mapa")));
  check("dashboard: fase da Lua", await visible(page.getByText("Fase da Lua")));
  check("dashboard sem rolagem lateral (390px)", await noOverflow(page));
  await shot(page, "04-dashboard-vazio");

  // 7. Dados de nascimento com busca de cidade
  await page.goto(`${APP}/perfil/nascimento`);
  await page.fill("#name", "Luna");
  await page.fill("#date", "1990-08-15");
  await page.fill("#time", "14:30");
  await page.fill("#cityId", "sao pa");
  await page.getByRole("option", { name: /São Paulo/ }).click();
  await page.fill("#birthName", "Luna Souza");
  await shot(page, "05-nascimento");
  await page.click("button[type=submit]");
  await page.waitForURL(`${APP}/mapa`, { timeout: 15000 });
  check("salvar nascimento → /mapa", true);
  check("mapa: roda renderizada", await visible(page.locator("svg[aria-label^='Mapa astral']")));
  check("mapa: Sol em Leão na tabela", await visible(page.getByRole("row", { name: /Sol.*Leão/ })));
  check("mapa sem rolagem lateral (390px)", await noOverflow(page));
  await shot(page, "06-mapa");

  // 8. Seu Guia (IA simulada)
  await page.getByRole("button", { name: "Ver minha leitura" }).click();
  await page.getByText("Uma leitura possível").first().waitFor({ timeout: 15000 });
  check("Seu Guia gera a interpretação", true);
  await shot(page, "07-mapa-guia");

  // 9. Sistema de casas
  await page.goto(`${APP}/mapa?casas=whole_sign`);
  check("Whole Sign selecionado", (await page.locator("a[aria-current=true]").textContent())?.includes("Whole Sign") ?? false);

  // 10. Amor sem o bump → oferta com e-mail preenchido
  await page.goto(`${APP}/amor`);
  const offer = page.getByRole("link", { name: "Liberar o Astarot Love" });
  const href = await offer.getAttribute("href").catch(() => null);
  check("amor sem bump → oferta com checkout e e-mail", Boolean(href?.includes(encodeURIComponent(email))), href ?? "");
  await shot(page, "08-amor-oferta");

  // 11. Bump comprado dentro do app → libera sem sair
  const w2 = await webhook(purchase(email, "offer-love-app-e2e", `ord-${run}-2`));
  check("webhook bump → processed", w2.status === 200 && w2.body.outcomes?.[0]?.result === "applied", JSON.stringify(w2.body));
  await page.goto(`${APP}/amor`);
  check("amor liberado após o bump", !(await visible(page.getByRole("link", { name: "Liberar o Astarot Love" })).catch(() => false)));
  await shot(page, "09-amor");

  // 11b. Tarot: sorteio no servidor, cartas viram, leitura
  await page.goto(`${APP}/tarot`);
  await page.getByRole("radio", { name: /Pergunta aberta/ }).click();
  await page.fill("#question", "O que merece minha atenção?");
  await page.getByRole("button", { name: "Embaralhar e tirar" }).click();
  await page.getByRole("button", { name: "Ler as cartas" }).waitFor({ timeout: 15000 });
  const figs = await page.locator("figure").count();
  check("tarot: 3 cartas sorteadas e reveladas", figs === 3, String(figs));
  await shot(page, "12-tarot-cartas");
  await page.getByRole("button", { name: "Ler as cartas" }).click();
  await page.getByText("tarot_reading").waitFor({ timeout: 15000 });
  check("tarot: leitura do Guia", true);
  check("tarot sem rolagem lateral", await noOverflow(page));
  await shot(page, "13-tarot-leitura");

  // 11c. Numerologia
  await page.goto(`${APP}/numerologia`);
  check("numerologia: Caminho de Vida 6 (15/08/1990)", (await page.locator("p.text-display").first().textContent())?.trim() === "6");
  check("numerologia: expressão calculada (nome informado)", await visible(page.getByText("Expressão")));
  await shot(page, "14-numerologia");

  // 11d. Lua: diário de intenção
  await page.goto(`${APP}/lua`);
  await page.fill("#intention", "Cultivar calma");
  await page.getByRole("button", { name: "Guardar" }).click();
  await page.getByRole("status").getByText("Guardado.").waitFor({ timeout: 10000 });
  await page.reload();
  check("lua: intenção guardada persiste", (await page.inputValue("#intention")) === "Cultivar calma");
  await shot(page, "15-lua");

  // 11e. Sonhos
  await page.goto(`${APP}/sonhos`);
  await page.fill("#content", "Sonhei que estava num rio escuro e uma cobra enorme nadava perto de mim.");
  await page.locator("label", { hasText: "Medo" }).click();
  await page.getByRole("button", { name: "Guardar e ler" }).click();
  await page.waitForURL(/\/sonhos\/[0-9a-f-]{36}$/, { timeout: 15000 });
  check("sonhos: símbolos Água e Cobra identificados", (await visible(page.getByText("Água", { exact: true }))) && (await visible(page.getByText("Cobra", { exact: true }))));
  await page.getByRole("button", { name: "Ler meu sonho" }).click();
  await page.getByText("dream_analysis").waitFor({ timeout: 15000 });
  check("sonhos: leitura do Guia", true);
  await page.reload();
  check("sonhos: leitura salva reaparece", await visible(page.getByText("dream_analysis")));
  await shot(page, "16-sonho");

  // 11f. Seu Guia
  await page.goto(`${APP}/guia?q=${encodeURIComponent("O que minha Lua representa?")}`);
  await page.getByRole("button", { name: "Perguntar" }).click();
  await page.getByText("Uma leitura possível: sua pergunta").waitFor({ timeout: 15000 });
  check("guia: resposta como consulta", true);
  await shot(page, "17-guia");

  // 11g. Sinastria com outra pessoa (sem horário)
  await page.goto(`${APP}/amor/sinastria`);
  await page.getByRole("link", { name: "Adicionar outra pessoa" }).click();
  await page.fill("#name", "Rafa");
  await page.fill("#date", "1992-03-02");
  await page.locator("label", { hasText: "Não sei o horário" }).click();
  await page.fill("#cityId", "reci");
  await page.getByRole("option", { name: /Recife/ }).click();
  await page.click("button[type=submit]");
  await page.waitForURL(/\/amor\/sinastria/, { timeout: 15000 });
  check("sinastria: Você & Rafa", await visible(page.getByRole("heading", { name: "Você & Rafa" })));
  check("sinastria: aviso de horário desconhecido", await visible(page.getByText("Sem o horário de Rafa")));
  await page.getByRole("button", { name: "Ler o mapa do casal" }).click();
  await page.getByText("synastry").waitFor({ timeout: 15000 });
  check("sinastria: leitura do Guia", true);
  check("sinastria sem rolagem lateral", await noOverflow(page));
  await shot(page, "18-sinastria");

  // 11h. Perfil
  await page.goto(`${APP}/perfil`);
  check("perfil: Astarot e Astarot Love ativos", (await page.getByText("ativo", { exact: true }).count()) === 2);
  await shot(page, "19-perfil");

  // 11i. Todas as páginas em 390 e 1280: sem erro e sem rolagem lateral
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/mapa", "/mapa?casas=equal", "/amor", "/amor/sinastria", "/tarot", "/numerologia", "/lua", "/sonhos", "/guia", "/perfil", "/perfil/nascimento", "/perfil/parceiro"]) {
      const resp = await page.goto(`${APP}${path}`);
      const ok = resp?.status() === 200 && (await noOverflow(page)) && !(await page.getByText(/undefined|NaN/).count());
      check(`página ${path} @${width}px`, ok, `status ${resp?.status()}`);
      if (process.env.TOUR) await shot(page, `tour-${width}-${path.replace(/[/?=]+/g, "_").replace(/^_|_$/g, "") || "inicio"}`);
    }
  }
  await page.setViewportSize({ width: 390, height: 900 });

  // 12. Desktop
  const d = await newPage(1280);
  await d.page.goto(`${APP}/auth/login`);
  await d.page.fill("#email", email);
  await d.page.fill("#password", password);
  await d.page.click("button[type=submit]");
  await d.page.waitForURL(`${APP}/`, { timeout: 10000 });
  check("login desktop → dashboard", true);
  await shot(d.page, "10-dashboard-desktop");
  await d.page.goto(`${APP}/mapa`);
  await shot(d.page, "11-mapa-desktop");

  // 13. Reembolso do principal bloqueia
  const w3 = await webhook({ event: "refunded", data: { id: `ord-${run}-1`, customer: { email } } });
  check("webhook reembolso → revoked_main", w3.body.outcomes?.[0]?.result === "revoked_main", JSON.stringify(w3.body));
  await d.page.goto(`${APP}/`);
  check("após reembolso → /acesso", d.page.url().endsWith("/acesso"), d.page.url());
} catch (e) {
  check("execução sem exceção", false, e instanceof Error ? e.message : String(e));
} finally {
  check("zero erros de JavaScript no navegador", errors.length === 0, errors.slice(0, 5).join(" | "));
  await browser.close();
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} verificações ok`);
  process.exit(failed ? 1 : 0);
}
