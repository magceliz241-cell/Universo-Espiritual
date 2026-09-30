import type { NextRequest } from "next/server";
import { normalizeCityQuery } from "@/lib/cities/normalize";
import { supabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

/** Busca de cidades (dado público GeoNames). GET /api/cities?q=sao pau&country=BR */
export async function GET(request: NextRequest) {
  const q = normalizeCityQuery(request.nextUrl.searchParams.get("q") ?? "");
  const country = (request.nextUrl.searchParams.get("country") ?? "").toUpperCase();
  if (q.length < 2) return Response.json({ cities: [] });
  if (!supabaseConfigured()) return Response.json({ error: "indisponível" }, { status: 503 });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_cities", {
    p_query: q,
    p_country: /^[A-Z]{2}$/.test(country) ? country : null,
    p_limit: 10,
  });
  if (error) return Response.json({ error: "falha na busca" }, { status: 500 });
  const cities = (data ?? []).map((c: Record<string, unknown>) => ({
    id: c.id,
    name: c.name,
    admin1_name: c.admin1_name,
    country_code: c.country_code,
    latitude: c.latitude,
    longitude: c.longitude,
    timezone: c.timezone,
  }));
  return Response.json({ cities }, { headers: { "Cache-Control": "public, max-age=3600" } });
}
