import {DonorType} from "@prisma/client";

export class DonorDetailCreateDto{
    volumePerDonation: number;
    numberOfDonations: number;
    Type: DonorType
}
