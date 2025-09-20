import {NextFunction, Request, Response} from "express";
import {validateWithZodSchema} from "../validations/ZodSchema.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {vitalCreateSchema} from "../validations/vital.validation";
import {VitalCreateDto} from "../dto/vitalCreate.dto";

export function vitalCreateValidationMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Get the blood-stat payload from request object.
    const vitalDto = req.body  as VitalCreateDto;

    //----> Check the validity of change-password-dto payload.
    const validVital = validateWithZodSchema(
        vitalCreateSchema,
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