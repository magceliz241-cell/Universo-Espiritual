import type { HouseSystem } from "./types";

/**
 * Configuração versionada do cálculo. Qualquer mudança que altere o resultado
 * de um mapa exige subir CHART_METHODOLOGY_VERSION (invalida o cache por hash).
 */
export const CHART_METHODOLOGY_VERSION = "chart-1.0.0";

export const DEFAULT_HOUSE_SYSTEM: HouseSystem = "placidus";
export const HOUSE_SYSTEMS: readonly HouseSystem[] = ["placidus", "whole_sign", "equal"];

/** Horário usado quando a hora de nascimento é desconhecida (sem casas/ângulos). */
export const UNKNOWN_TIME_NOON = "12:00:00";
