import {NextFunction,  Request, Response} from "express";
import {validateWithZodSchema} from "../validations/ZodSchema.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {BloodStatCreateDto} from "../dto/bloodStatCreate.dto";
import {bloodStatCreateSchema} from "../validations/bloodStat.validation";


export function bloodStatCreateValidationMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Get the blood-stat payload from request object.
    const bloodStat = req.body  as BloodStatCreateDto;

    //----> Check the validity of change-password-dto payload.
    const validBloodStat = validateWithZodSchema(
        bloodStatCreateSchema,
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