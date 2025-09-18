import {NextFunction, Request, Response} from "express";
import {LoginDto} from "../dto/login.dto";
import {validateWithZodSchema} from "../validations/ZodSchema.validation";
import {loginSchema} from "../validations/auth.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function loginValidationMiddleware(req: Request, res: Response, next: NextFunction) {
    //----> Get the login payload from the request.
    const loginDto = req.body as LoginDto;

    //----> Check the validity of login-dto.
    const validLoginDto = validateWithZodSchema(loginSchema, loginDto)
    if (!validLoginDto){
        throw catchError(StatusCodes.BAD_REQUEST, "You are required to provide all values!")
    }

    //----> Move unto the next middleware.
    next();
    return validLoginDto;

}