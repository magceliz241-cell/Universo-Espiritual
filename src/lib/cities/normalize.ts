/**
 * Normalização usada na importação (coluna search_name) e na busca.
 * Minúsculas, sem acentos, só letras/números/espaço/hífen/apóstrofo, espaços únicos.
 */
export function normalizeCityQuery(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 '\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}
