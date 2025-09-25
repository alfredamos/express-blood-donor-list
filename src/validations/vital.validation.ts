import {z} from "zod";

export const vitalCreateSchema = z.object({
    pressureUp: z.number(),
    pressureLow: z.number(),
    temperature: z.number(),
    height: z.number(),
    weight: z.number(),
});

export const vitalUpdateSchema = z.object({
    pressureUp: z.number(),
    pressureLow: z.number(),
    temperature: z.number(),
    height: z.number(),
    weight: z.number(),
});