import { z } from "zod";
import { HOUSE_SYSTEMS } from "./config";

/** Validação do input vindo do cliente (sempre no servidor). */
export const birthDataSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).nullable(),
  timezone: z.string().min(1).max(64),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  fold: z.union([z.literal(0), z.literal(1)]).optional(),
});

export const chartRequestSchema = z.object({
  birth: birthDataSchema,
  houseSystem: z.enum(HOUSE_SYSTEMS as unknown as [string, ...string[]]).default("placidus"),
});
