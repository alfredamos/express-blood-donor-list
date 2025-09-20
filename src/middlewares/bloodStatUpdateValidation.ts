import {NextFunction,  Request, Response} from "express";
import {bloodStatUpdateSchema} from "../validations/bloodStat.validation";
import {validateWithZodSchema} from "../validations/ZodSchema.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {BloodStatUpdateDto} from "../dto/bloodStatUpdate.dto";



export function bloodStatUpdateValidationMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Get the blood-stat payload from request object.
    const bloodStat = req.body  as BloodStatUpdateDto;

    //----> Check the validity of change-password-dto payload.
    const validBloodStat = validateWithZodSchema(
        bloodStatUpdateSchema,
        bloodStat,
    );

    if (!validBloodStat) {
        throw catchError(
            StatusCodes.BAD_REQUEST,
            "Please provide all required values!"
        );
    }

    //----> Move on to the next middleware
    next();
    return validBloodStat;
}