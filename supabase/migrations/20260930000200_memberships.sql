-- Seu Universo — acesso via Cakto.
-- Modelo: plano principal (base) + order bump de relacionamento (love), ambos
-- VITALÍCIOS. O bump também é vendido dentro do app.
-- Fonte única de acesso: public.memberships. Só o servidor (service_role) escreve.
-- A compra só se liga a uma conta quando o e-mail da conta é CONFIRMADO
-- (impede alguém de criar conta com o e-mail de outro comprador).

-- memberships ----------------------------------------------------------------
create table if not exists public.memberships (
  id uuid primary key default extensions.gen_random_uuid(),
  email text not null check (email = lower(btrim(email)) and position('@' in email) > 1),
  user_id uuid references auth.users (id) on delete set null,
  product_id text not null default 'seu-universo',
  status text not null default 'pending'
    check (status in ('active', 'refunded', 'chargeback', 'inactive', 'pending')),
  base boolean not null default false,       -- plano principal
  love boolean not null default false,       -- áreas de relacionamento (bump)
  cakto_main_order_id text,
  cakto_love_order_id text,
  cakto_customer_id text,
  revoked_order_ids text[] not null default '{}',
  main_paid_at timestamptz,
  love_paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, product_id),
  unique (user_id, product_id)
);

drop trigger if exists memberships_updated_at on public.memberships;
create trigger memberships_updated_at before update on public.memberships
  for each row execute function public.set_updated_at();

alter table public.memberships enable row level security;
drop policy if exists memberships_select_own on public.memberships;
create policy memberships_select_own on public.memberships for select to authenticated
  using (user_id = auth.uid());
revoke insert, update, delete on public.memberships from anon, authenticated;
revoke all on public.memberships from anon;

-- Log de webhooks (sem segredo) ---------------------------------------------
create table if not exists public.cakto_webhook_events (
  id bigint generated always as identity primary key,
  event_key text not null unique,        -- `${event}:${order_id}:${kind}`
  event text not null,
  order_id text,
  email text,
  kind text,                             -- main | love | null
  product_ids text[] not null default '{}',
  processing_status text not null default 'received' check (processing_status in (
    'received', 'processed', 'ignored', 'user_pending', 'needs_review', 'error', 'duplicate')),
  result text,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
alter table public.cakto_webhook_events enable row level security;
revoke all on public.cakto_webhook_events from anon, authenticated;

-- Helpers ----------------------------------------------------------------------
create or replace function public.confirmed_user_id_by_email(p_email text) returns uuid
language sql stable security definer set search_path = public, auth as $$
  select id from auth.users
  where lower(email) = lower(btrim(p_email)) and email_confirmed_at is not null
  limit 1
$$;
revoke execute on function public.confirmed_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.confirmed_user_id_by_email(text) to service_role;

-- Compra aprovada ------------------------------------------------------------
-- p_kind: 'main' (plano) | 'love' (bump de relacionamento)
-- Retorno: applied | applied_user_pending | already_applied | order_already_revoked
create or replace function public.cakto_apply_purchase(
  p_email text, p_kind text, p_order_id text, p_paid_at timestamptz default now(), p_customer_id text default null
) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(btrim(p_email));
  v_row public.memberships;
  v_uid uuid;
begin
  if v_email is null or position('@' in v_email) < 2 then raise exception 'email inválido'; end if;
  if p_kind not in ('main', 'love') then raise exception 'kind inválido: %', p_kind; end if;
  if p_order_id is null or btrim(p_order_id) = '' then raise exception 'order_id obrigatório'; end if;

  insert into public.memberships (email) values (v_email)
    on conflict (email, product_id) do nothing;
  select * into v_row from public.memberships
    where email = v_email and product_id = 'seu-universo' for update;

  if p_order_id = any (v_row.revoked_order_ids) then
    return 'order_already_revoked';
  end if;

  if p_kind = 'main' then
    if v_row.cakto_main_order_id = p_order_id and v_row.base then return 'already_applied'; end if;
    update public.memberships set
      base = true,
      status = 'active',
      cakto_main_order_id = p_order_id,
      main_paid_at = coalesce(p_paid_at, now()),
      cakto_customer_id = coalesce(p_customer_id, cakto_customer_id)
    where id = v_row.id;
  else
    if v_row.cakto_love_order_id = p_order_id and v_row.love then return 'already_applied'; end if;
    update public.memberships set
      love = true,
      -- o bump pode chegar antes do principal: acesso só vale com base = true
      status = case when base then 'active' else status end,
      cakto_love_order_id = p_order_id,
      love_paid_at = coalesce(p_paid_at, now()),
      cakto_customer_id = coalesce(p_customer_id, cakto_customer_id)
    where id = v_row.id;
  end if;

  v_uid := public.confirmed_user_id_by_email(v_email);
  if v_uid is not null then
    update public.memberships set user_id = v_uid
      where id = v_row.id and user_id is null
        and not exists (select 1 from public.memberships m where m.user_id = v_uid and m.product_id = 'seu-universo');
    return 'applied';
  end if;
  return 'applied_user_pending';
end $$;

-- Reembolso / chargeback -----------------------------------------------------
-- Retorno: revoked_main | revoked_love | already_revoked | recorded_before_purchase
--          | recorded_unknown_order | not_found
create or replace function public.cakto_apply_revocation(
  p_order_id text, p_email text, p_reason text
) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_email text := lower(btrim(p_email));
  v_row public.memberships;
begin
  if p_reason not in ('refunded', 'chargeback') then raise exception 'motivo inválido: %', p_reason; end if;
  if p_order_id is null or btrim(p_order_id) = '' then raise exception 'order_id obrigatório'; end if;

  select * into v_row from public.memberships
    where product_id = 'seu-universo'
      and (cakto_main_order_id = p_order_id or cakto_love_order_id = p_order_id)
    for update;
  if not found and v_email is not null then
    select * into v_row from public.memberships
      where email = v_email and product_id = 'seu-universo' for update;
  end if;

  if not found then
    if v_email is null or position('@' in v_email) < 2 then return 'not_found'; end if;
    insert into public.memberships (email, status, revoked_order_ids)
      values (v_email, 'inactive', array[p_order_id]);
    return 'recorded_before_purchase';
  end if;

  if p_order_id = any (v_row.revoked_order_ids) then return 'already_revoked'; end if;

  if v_row.cakto_main_order_id = p_order_id then
    -- Sem o plano principal não há acesso (o bump depende dele).
    update public.memberships set
      base = false, love = false, status = p_reason,
      revoked_order_ids = array_append(revoked_order_ids, p_order_id)
    where id = v_row.id;
    return 'revoked_main';
  elsif v_row.cakto_love_order_id = p_order_id then
    update public.memberships set
      love = false,
      revoked_order_ids = array_append(revoked_order_ids, p_order_id)
    where id = v_row.id;
    return 'revoked_love';
  else
    update public.memberships set revoked_order_ids = array_append(revoked_order_ids, p_order_id)
      where id = v_row.id;
    return 'recorded_unknown_order';
  end if;
end $$;

revoke execute on function public.cakto_apply_purchase(text, text, text, timestamptz, text) from public, anon, authenticated;
revoke execute on function public.cakto_apply_revocation(text, text, text) from public, anon, authenticated;
grant execute on function public.cakto_apply_purchase(text, text, text, timestamptz, text) to service_role;
grant execute on function public.cakto_apply_revocation(text, text, text) to service_role;

-- Leitura de acesso ----------------------------------------------------------
create or replace function public.has_active_membership(p_uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where user_id = p_uid and product_id = 'seu-universo' and status = 'active' and base
  )
$$;

create or replace function public.has_love(p_uid uuid default auth.uid()) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where user_id = p_uid and product_id = 'seu-universo' and status = 'active' and base and love
  )
$$;

-- A pessoa logada só pode consultar o próprio acesso.
create or replace function public.my_access() returns table (active boolean, love boolean)
language sql stable security definer set search_path = public as $$
  select public.has_active_membership(auth.uid()), public.has_love(auth.uid())
$$;

revoke execute on function public.has_active_membership(uuid) from public, anon, authenticated;
revoke execute on function public.has_love(uuid) from public, anon, authenticated;
grant execute on function public.has_active_membership(uuid) to service_role;
grant execute on function public.has_love(uuid) to service_role;
revoke execute on function public.my_access() from public, anon;
grant execute on function public.my_access() to authenticated, service_role;

-- Vínculo compra → conta quando o e-mail é confirmado -------------------------
create or replace function public.link_memberships_on_confirm() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.email_confirmed_at is not null
     and (tg_op = 'INSERT' or old.email_confirmed_at is null or old.email is distinct from new.email) then
    update public.memberships set user_id = new.id
      where email = lower(btrim(new.email)) and user_id is null
        and not exists (
          select 1 from public.memberships m where m.user_id = new.id and m.product_id = memberships.product_id);
  end if;
  return new;
end $$;
revoke execute on function public.link_memberships_on_confirm() from public, anon, authenticated;

drop trigger if exists on_auth_user_confirmed_link_memberships on auth.users;
create trigger on_auth_user_confirmed_link_memberships
  after insert or update of email_confirmed_at, email on auth.users
  for each row execute function public.link_memberships_on_confirm();
