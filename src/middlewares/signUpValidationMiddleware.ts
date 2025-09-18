import {NextFunction, Request, Response} from "express";
import {SignupDto} from "../dto/signup.dto";
import {validateWithZodSchema} from "../validations/ZodSchema.validation";
import {signupSchema} from "../validations/auth.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function signUpValidationMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Get the sign-up payload from request.
    const signupDto = req.body as SignupDto

    //----> Check the validity of signup-dto.
    const validSignupDto = validateWithZodSchema(signupSchema, signupDto);
    if (!validSignupDto){
        throw catchError(StatusCodes.BAD_REQUEST, "Please provide all required values!");
    }

    //----> Move unto the next middleware.
    next();
    return validSignupDto;
}