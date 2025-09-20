import {z} from "zod";

export const bloodStatCreateSchema = z.object({
    genoType: z.string(),
    bloodGroup: z.string()
})

export const bloodStatUpdateSchema = z.object({
    id: z.string(),
    genoType: z.string(),
    bloodGroup: z.string()
})