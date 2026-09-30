import { getXalen, XalenWasm } from "@/lib/astro/xalen-loader";
import buildInfo from "../../../../../vendor/xalen-wasm/BUILD_INFO.json";

/** Smoke test do motor: calcula o Sol em J2000 e informa a versão fixada. */
export async function GET() {
  const { xalen, initMs } = getXalen();
  const jd = XalenWasm.julianDay(2000, 1, 1, 12);
  const t0 = performance.now();
  const sun = xalen.tropicalLongitude(jd, 0);
  return Response.json({
    ok: Math.abs(sun - 280.3689) < 5 / 3600,
    engine: { name: "xalen", commit: buildInfo.commit, method: "analytical" },
    sun_j2000: sun,
    init_ms: Math.round(initMs * 100) / 100,
    calc_ms: Math.round((performance.now() - t0) * 1000) / 1000,
  });
}
