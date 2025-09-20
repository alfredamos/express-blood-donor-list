import {NextFunction, Request, Response} from "express";
import {validateWithZodSchema} from "../validations/ZodSchema.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {VitalUpdateDto} from "../dto/vitalUpdate.dto";
import {vitalUpdateSchema} from "../validations/vital.validation";

export function vitalUpdateValidationMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Get the blood-stat payload from request object.
    const vitalDto = req.body  as VitalUpdateDto;

    //----> Check the validity of change-password-dto payload.
    const validVital = validateWithZodSchema(
        vitalUpdateSchema,
        vitalDto,
    );

    if (!validVital) {
        throw catchError(
            StatusCodes.BAD_REQUEST,
            "Please provide all required values!"
        );
    }

    //----> Move on to the next middleware
    next();
    return validVital;
}