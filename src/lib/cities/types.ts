export interface City {
  id: number;
  name: string;
  admin1_name: string | null;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export function cityLabel(c: Pick<City, "name" | "admin1_name" | "country_code">): string {
  return [c.name, c.admin1_name, c.country_code].filter(Boolean).join(", ");
}
