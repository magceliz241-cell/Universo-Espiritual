import type { BirthChart, BirthData, ChartOptions } from "./types";

/**
 * Contrato do motor astronômico. O app depende só desta interface; a única
 * implementação é XalenEphemerisEngine (src/lib/astro/xalen-engine.ts).
 */
export interface EphemerisEngine {
  calculateChart(input: BirthData, options: ChartOptions): Promise<BirthChart>;
}
