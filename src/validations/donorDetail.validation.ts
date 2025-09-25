import {z} from "zod";
import {DonorType} from "@prisma/client";

export const donorDetailCreateSchema = z.object({
    volumePerDonation: z.number(),
    numberOfDonations: z.number(),
    type: z.enum(DonorType)
})

export const donorDetailUpdateSchema = z.object({
    id: z.string(),
    volumePerDonation: z.number(),
    numberOfDonations: z.number(),
    type: z.enum(DonorType)
})