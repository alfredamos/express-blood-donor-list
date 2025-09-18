import {NextFunction, Request, Response} from "express";
import {EditProfileDto} from "../dto/editProfile.dto";
import {validateWithZodSchema} from "../validations/ZodSchema.validation";
import {editProfileSchema} from "../validations/auth.validation";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function editProvideValidationMiddleware(req: Request, res: Response, next: NextFunction) {
    //----> Get the edit-profile-dto payload from request.
    const editProfileDto = req.body as EditProfileDto;

    //----> Check the validity of edit-profile-dto payload.
    const validEditProfileDto = validateWithZodSchema(editProfileSchema, editProfileDto);
    if (!validEditProfileDto) {
        throw catchError(StatusCodes.BAD_REQUEST, "Please provide all required values!");
    }

    //----> Move on to the next middleware.
    next();
    return validEditProfileDto

}