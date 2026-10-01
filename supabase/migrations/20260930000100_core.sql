-- Seu Universo — tabelas centrais do app.
-- Todas com RLS: cada pessoa só enxerga e altera as próprias linhas.
-- Idempotente (pode rodar de novo sem erro).

create extension if not exists pgcrypto with schema extensions;

-- updated_at automático --------------------------------------------------
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- profiles -----------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  -- Nome completo de nascimento, usado só pela numerologia.
  birth_name text check (char_length(birth_name) <= 200),
  onboarding_done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users
  for each row execute function public.handle_new_user();

-- birth_profiles: dados de nascimento (a própria pessoa e parceiros) --------
create table if not exists public.birth_profiles (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('self', 'partner')),
  name text not null check (char_length(name) between 1 and 80),
  birth_date date not null,
  birth_time time,
  time_known boolean not null default true,
  timezone text not null check (char_length(timezone) between 1 and 64),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  city_id bigint,
  place_label text check (char_length(place_label) <= 200),
  fold smallint check (fold in (0, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((time_known and birth_time is not null) or (not time_known and birth_time is null)),
  unique (id, user_id)
);
create unique index if not exists birth_profiles_one_self
  on public.birth_profiles (user_id) where kind = 'self';
create index if not exists birth_profiles_user on public.birth_profiles (user_id);

drop trigger if exists birth_profiles_updated_at on public.birth_profiles;
create trigger birth_profiles_updated_at before update on public.birth_profiles
  for each row execute function public.set_updated_at();

-- birth_charts: resultado calculado (nunca só texto de IA) ------------------
create table if not exists public.birth_charts (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  birth_profile_id uuid not null,
  input_hash text not null check (input_hash ~ '^[0-9a-f]{64}$'),
  input jsonb not null,            -- nascimento normalizado (inclui UTC e JD)
  timezone text not null,
  latitude double precision not null,
  longitude double precision not null,
  engine text not null,            -- 'xalen'
  engine_version text not null,    -- commit
  engine_wrapper text not null,    -- 'su-ephem x.y.z'
  method text not null,            -- 'analytical'
  zodiac text not null,            -- 'tropical'
  house_system text not null,
  house_system_effective text,
  methodology_version text not null,
  chart jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, input_hash),
  -- O mapa só pode apontar para um perfil de nascimento do mesmo usuário.
  foreign key (birth_profile_id, user_id) references public.birth_profiles (id, user_id) on delete cascade
);
create index if not exists birth_charts_profile on public.birth_charts (birth_profile_id);

-- numerology_profiles ------------------------------------------------------
create table if not exists public.numerology_profiles (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  input_hash text not null check (input_hash ~ '^[0-9a-f]{64}$'),
  method text not null,
  method_version text not null,
  result jsonb not null,
  calculated_at timestamptz not null default now(),
  unique (user_id, input_hash)
);

-- ai_generations: toda saída de IA + observabilidade ------------------------
create table if not exists public.ai_generations (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  task text not null,
  model text not null,
  prompt_version text not null,
  knowledge_version text not null,
  cache_key text not null check (cache_key ~ '^[0-9a-f]{64}$'),
  output jsonb,
  tokens_in integer,
  tokens_out integer,
  latency_ms integer,
  cache_hit boolean not null default false,
  error text check (char_length(error) <= 500),
  created_at timestamptz not null default now()
);
create index if not exists ai_generations_cache on public.ai_generations (user_id, cache_key) where error is null;

-- tarot_readings -------------------------------------------------------------
create table if not exists public.tarot_readings (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  spread text not null,
  question text check (char_length(question) <= 500),
  cards jsonb not null,            -- [{card, position, reversed}]
  rng text not null,               -- ex.: 'node:crypto.randomInt'
  methodology_version text not null,
  generation_id uuid references public.ai_generations (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists tarot_readings_user on public.tarot_readings (user_id, created_at desc);

-- moon_journeys: intenção/diário por fase ----------------------------------
create table if not exists public.moon_journeys (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  phase text not null check (phase in (
    'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
    'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent')),
  intention text check (char_length(intention) <= 1000),
  journal text check (char_length(journal) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);
drop trigger if exists moon_journeys_updated_at on public.moon_journeys;
create trigger moon_journeys_updated_at before update on public.moon_journeys
  for each row execute function public.set_updated_at();

-- dream_entries ------------------------------------------------------------
create table if not exists public.dream_entries (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null check (char_length(content) between 1 and 5000),
  emotions text[] not null default '{}',
  symbols text[] not null default '{}',
  generation_id uuid references public.ai_generations (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists dream_entries_user on public.dream_entries (user_id, created_at desc);

-- usage_events -------------------------------------------------------------
create table if not exists public.usage_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  event text not null check (char_length(event) <= 64),
  feature text check (char_length(feature) <= 64),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists usage_events_user on public.usage_events (user_id, created_at desc);

-- RLS ------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.birth_profiles enable row level security;
alter table public.birth_charts enable row level security;
alter table public.numerology_profiles enable row level security;
alter table public.ai_generations enable row level security;
alter table public.tarot_readings enable row level security;
alter table public.moon_journeys enable row level security;
alter table public.dream_entries enable row level security;
alter table public.usage_events enable row level security;

-- profiles: ler e editar o próprio (a criação é feita pelo trigger).
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Tabelas do usuário: CRUD da própria linha.
do $$
declare t text;
begin
  foreach t in array array['birth_profiles', 'birth_charts', 'numerology_profiles', 'tarot_readings',
                           'moon_journeys', 'dream_entries']
  loop
    execute format('drop policy if exists %1$s_own on public.%1$s', t);
    execute format(
      'create policy %1$s_own on public.%1$s for all to authenticated '
      'using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;

-- ai_generations e usage_events: a pessoa lê e insere as próprias; não edita.
drop policy if exists ai_generations_select_own on public.ai_generations;
create policy ai_generations_select_own on public.ai_generations for select to authenticated using (user_id = auth.uid());
drop policy if exists ai_generations_insert_own on public.ai_generations;
create policy ai_generations_insert_own on public.ai_generations for insert to authenticated with check (user_id = auth.uid());
drop policy if exists usage_events_insert_own on public.usage_events;
create policy usage_events_insert_own on public.usage_events for insert to authenticated with check (user_id = auth.uid());
drop policy if exists usage_events_select_own on public.usage_events;
create policy usage_events_select_own on public.usage_events for select to authenticated using (user_id = auth.uid());

-- Visitantes (anon) não têm acesso a nenhuma tabela do usuário.
revoke all on public.profiles, public.birth_profiles, public.birth_charts, public.numerology_profiles,
  public.ai_generations, public.tarot_readings, public.moon_journeys, public.dream_entries,
  public.usage_events from anon;
