# Astarot: plano do login com Google (OAuth)

> Status (03/10/2026): **provedor ligado no Supabase e código pronto** (branch `claude/vigilant-heisenberg-0ff2f3`).
> Falta: `NEXT_PUBLIC_GOOGLE_AUTH=1` na Vercel + redeploy, o template *Change email address* (SETUP §1.6) e o teste
> manual da seção 4. Decisões do Guilherme que mudaram este plano estão na seção 6.

---

## 1. Por que vale a pena

- **Menos atrito:** a pessoa toca em "Continuar com Google" e entra. Não precisa criar senha nem esperar o e-mail de
  confirmação (que às vezes cai no spam).
- **Continua seguro:** o Google só entrega e-mails **verificados**. O Supabase cria a conta já com o e-mail
  confirmado, e o gatilho que temos no banco (`link_memberships_on_confirm`) liga a compra à conta na hora, do mesmo
  jeito que acontece depois da confirmação por e-mail. Ninguém consegue entrar com o e-mail de outra pessoa.
- **Sem mudança no banco:** as migrations atuais já cobrem esse caso.

## 2. O ponto de atenção: o e-mail precisa ser o mesmo da compra

O acesso é liberado pelo **e-mail da compra na Cakto**. Se alguém compra com `ana@hotmail.com` e entra com a conta
Google `ana@gmail.com`, o app não encontra a compra e mostra a tela "Ainda não encontramos sua compra". Por isso:
- o botão vem acompanhado da frase "Use a conta Google com o mesmo e-mail da compra";
- a tela `/acesso` ganha uma linha para quem entrou com Google ("Entrou com Google? Confira se é o mesmo e-mail da
  compra, ou saia e entre com o e-mail da compra").

## 3. Quem faz o quê

### 3.1 Configuração (Guilherme, com o Cowork no Chrome)

**Google Cloud Console** (https://console.cloud.google.com), com a conta Google do produto:
1. Criar um projeto chamado **Astarot**.
2. *APIs e serviços → Tela de consentimento OAuth* (ou *Google Auth Platform → Branding*):
   - tipo **Externo**; nome do app **Astarot**; e-mail de suporte; logo (o mesmo da landing, quadrado);
   - domínios autorizados: o domínio do app e `supabase.co`;
   - links: Política de Privacidade `https://<landing>/privacidade` e Termos `https://<landing>/termos`;
   - escopos: só `openid`, `email` e `profile` (escopos básicos não exigem a verificação demorada do Google);
   - publicar o app (*Em produção*). Em modo de teste, só os e-mails cadastrados como testadores conseguem entrar.
3. *Credenciais → Criar credenciais → ID do cliente OAuth → Aplicativo da Web*:
   - Origens JavaScript autorizadas: `https://<app>` (e `http://localhost:3000` para testes locais);
   - URI de redirecionamento autorizado: **`https://vyynstiepcqvxitwsipx.supabase.co/auth/v1/callback`**;
   - copiar o **ID do cliente** e o **segredo do cliente**.

**Supabase** (projeto `vyynstiepcqvxitwsipx`):
4. *Authentication → Sign In / Providers → Google*: ativar e colar o ID do cliente e o segredo (o Guilherme cola o
   segredo; ninguém digita por ele).
5. *Authentication → URL Configuration → Redirect URLs*: confirmar que existe `https://<app>/**` (já faz parte do
   SETUP). Sem isso, o Google devolve a pessoa para o endereço errado.
6. Avisar o Claude Code de que o provedor está ligado.

> Na tela do Google aparece "continuar para vyynstiepcqvxitwsipx.supabase.co". Para mostrar o domínio do Astarot é
> preciso o domínio personalizado do Supabase (complemento pago). Funciona normalmente sem ele.

### 3.2 Código (Claude Code, uma rodada)

1. **Botão "Continuar com Google"** nas telas de login e de cadastro, acima do formulário de e-mail, com o separador
   "ou". Ao tocar, chama `supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo:
   "<origem>/auth/callback?next=<destino>" } })`.
2. **Retorno:** a rota `/auth/callback` já existe e já troca o código pela sessão (fluxo PKCE). Só conferir que o
   `next` continua passando pelo `safeNext` (evita redirecionamento para fora do app).
3. **Chave liga/desliga:** o botão só aparece com `NEXT_PUBLIC_GOOGLE_AUTH=1` na Vercel. Assim o código pode ir para
   o ar antes de o Google estar configurado.
4. **Nome de exibição:** no primeiro acesso via Google, preencher `profiles.display_name` com o primeiro nome que o
   Google informa (só se estiver vazio). A foto do Google não é guardada.
5. **Textos:** a frase do mesmo e-mail perto do botão e a linha nova em `/acesso`.
6. **Política de Privacidade:** acrescentar o Google como opção de login (recebemos nome e e-mail; não pedimos
   acesso a mais nada da conta).
7. **Testes:** teste unitário do botão (só aparece com a chave ligada, monta o `redirectTo` certo). O ambiente de
   testes de ponta a ponta simula o Supabase e não simula o Google; o fluxo completo fica para o teste manual abaixo.

## 4. Teste manual (Guilherme, depois do deploy)

- [ ] Conta Google **com** compra (mesmo e-mail): toca no botão, escolhe a conta, cai direto no Início.
- [ ] Conta Google **sem** compra: cai em "Ainda não encontramos sua compra", com a dica do e-mail.
- [ ] Quem já tinha conta por e-mail e senha entra com o Google do mesmo e-mail: continua na mesma conta, com o mapa
      e os dados de antes (o Supabase junta as duas formas de entrar quando o e-mail é verificado).
- [ ] Compra feita **depois** de entrar com Google: o webhook da Cakto libera na hora (atualizar a página).
- [ ] Sair e entrar de novo pelo Google: não pede senha nem e-mail de confirmação.

## 5. Riscos e decisões

| Ponto | Decisão |
|---|---|
| E-mail do Google diferente do da compra | Avisos no botão e em `/acesso`; o suporte orienta a entrar com o e-mail da compra |
| Conta criada por e-mail mas nunca confirmada, depois entra com Google | O Supabase dá preferência à identidade verificada (Google) e remove a não confirmada, por segurança. Comportamento esperado; testar no item 3 |
| Remover login por e-mail | **Não.** Continua como alternativa (e é para onde aponta o link de entrega da Cakto) |
| Apple, Facebook | Fora do escopo. Mesmo caminho, se um dia for pedido |

## 6. O que mudou na implementação (decisões do Guilherme, 03/10/2026)

- **Google é a opção principal** do login e do cadastro: botão centralizado, com o "G" oficial colorido (tema escuro
  das diretrizes de marca do Google). Embaixo, só uma frase com a alternativa pelo e-mail do checkout
  (`?metodo=email`), que continua igual a antes. Substitui o item 3.2.1 (botão acima do formulário com "ou").
- **E-mail do Google diferente do da compra** (substitui a seção 2): em `/acesso` a pessoa informa o e-mail usado no
  checkout. O app pede ao Supabase a **troca do e-mail da conta** para esse endereço; o Supabase manda um link para
  ele e só depois da confirmação o e-mail muda e o gatilho `link_memberships_on_confirm` liga a compra à conta.
  Digitar o e-mail sozinho não libera nada, e um e-mail que já tem conta própria é recusado (a pessoa entra por ela).
  Sem migration nova: o gatilho já reage à troca de e-mail confirmada. Limite de envios: o do próprio Supabase.
- **Nome de exibição:** em vez de gravar no primeiro acesso, o primeiro nome do Google vem sugerido no formulário do
  mapa, que agora é a primeira tela de quem ainda não tem mapa.
- Teste manual extra: conta Google sem compra → informar o e-mail do checkout em `/acesso` → confirmar o link →
  atualizar `/acesso` → entra no app (e o e-mail da conta passa a ser o da compra).
