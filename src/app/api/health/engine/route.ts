import { getEphem } from "@/lib/astro/ephem-loader";
import { XalenEphemerisEngine } from "@/lib/astro/xalen-engine";

/** Smoke test do motor: Sol em J2000 + versão fixada. Não expõe dados de usuário. */
export async function GET() {
  const { initMs } = getEphem();
  const t0 = performance.now();
  const chart = new XalenEphemerisEngine().calculateChartSync(
    { date: "2000-01-01", time: "12:00", timezone: "UTC", latitude: 0, longitude: 0 },
    { houseSystem: "placidus" },
  );
  const sun = chart.planets.sun.longitude;
  return Response.json({
    ok: Math.abs(sun - 280.3689) < 5 / 3600,
    engine: chart.engine,
    sun_j2000: sun,
    init_ms: Math.round(initMs * 100) / 100,
    chart_ms: Math.round((performance.now() - t0) * 100) / 100,
  });
}
