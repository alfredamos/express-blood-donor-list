import {NextFunction, Request, Response} from "express";
import {validateWithZodSchema} from "../validations/ZodSchema.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {DonorDetailUpdateDto} from "../dto/donorDetailUpdate.dto";
import {donorDetailUpdateSchema} from "../validations/donorDetail.validation";

export function donorDetailUpdateValidationMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Get the blood-stat payload from request object.
    const donorDetailDto = req.body  as DonorDetailUpdateDto;

    //----> Check the validity of change-password-dto payload.
    const validDonorDetail = validateWithZodSchema(
        donorDetailUpdateSchema,
        donorDetailDto,
    );

    if (!validDonorDetail) {
        throw catchError(
            StatusCodes.BAD_REQUEST,
            "Please provide all required values!"
        );
    }

    //----> Move on to the next middleware
    next();
    return validDonorDetail;
}