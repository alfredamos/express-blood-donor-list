import {Request, Response, NextFunction} from "express";
import {ChangePasswordDto} from "../dto/changePassword.dto";
import {validateWithZodSchema} from "../validations/ZodSchema.validation";
import {changePasswordSchema} from "../validations/auth.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function changePasswordValidationMiddleware(req: Request, res: Response, next: NextFunction) {
    //----> Get the change-password-dto payload from request.
    const changePasswordDto = req.body as ChangePasswordDto;

    //----> Check the validity of change-password-dto payload.
    const validChangePasswordDto = validateWithZodSchema(
        changePasswordSchema,
        changePasswordDto,
    );

    if (!validChangePasswordDto) {
        throw catchError(
            StatusCodes.BAD_REQUEST,
            "Please provide all required values!"
        );
    }

    //----> Move on to the next middleware
    next();
    return validChangePasswordDto;
}