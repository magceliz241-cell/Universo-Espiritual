-- Seu Universo — base própria de cidades (GeoNames, CC-BY 4.0).
-- Leitura pública (dado aberto); escrita só pelo script de importação (service_role).

create extension if not exists pg_trgm with schema extensions;

create table if not exists public.cities (
  id bigint primary key,                 -- geonameid
  name text not null,
  ascii_name text not null,
  search_name text not null,             -- minúsculas, sem acentos (gerado na importação)
  admin1_code text,
  admin1_name text,
  country_code char(2) not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  timezone text not null,
  population integer not null default 0,
  feature_code text,
  source_dump date not null              -- data do dump GeoNames importado
);

create index if not exists cities_search_prefix on public.cities (search_name text_pattern_ops);
create index if not exists cities_search_trgm on public.cities using gin (search_name extensions.gin_trgm_ops);
create index if not exists cities_country_pop on public.cities (country_code, population desc);

alter table public.cities enable row level security;
drop policy if exists cities_public_read on public.cities;
create policy cities_public_read on public.cities for select to anon, authenticated using (true);
revoke insert, update, delete on public.cities from anon, authenticated;

-- Busca: `p_query` já deve vir normalizado (minúsculas, sem acentos) pelo servidor.
-- Prefixo primeiro (mais populosas antes), depois similaridade por trigramas.
create or replace function public.search_cities(p_query text, p_country char(2) default null, p_limit int default 10)
returns setof public.cities
language sql stable set search_path = public, extensions as $$
  with q as (select lower(btrim(p_query)) as s, least(greatest(coalesce(p_limit, 10), 1), 25) as lim)
  select c.id, c.name, c.ascii_name, c.search_name, c.admin1_code, c.admin1_name, c.country_code, c.latitude, c.longitude, c.timezone, c.population, c.feature_code, c.source_dump from (
    select c.*, 0 as rank_group, c.population::float as score
    from public.cities c, q
    where char_length(q.s) >= 2 and c.search_name like q.s || '%'
      and (p_country is null or c.country_code = p_country)
    union all
    select c.*, 1 as rank_group, similarity(c.search_name, q.s)::float as score
    from public.cities c, q
    where char_length(q.s) >= 3 and c.search_name % q.s and c.search_name not like q.s || '%'
      and (p_country is null or c.country_code = p_country)
  ) c
  order by c.rank_group, c.score desc, c.population desc, c.id
  limit (select lim from q)
$$;
grant execute on function public.search_cities(text, char, int) to anon, authenticated, service_role;
