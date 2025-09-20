import {DonorType} from "@prisma/client";

export class DonorDetailUpdateDto{
    id:string;
    volumePerDonation: number;
    numberOfDonations: number;
    Type: DonorType
}