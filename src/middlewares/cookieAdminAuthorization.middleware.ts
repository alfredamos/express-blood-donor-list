import {NextFunction, Request, Response} from "express";
import {authenticationHelperFunction} from "./authenticationHelperfunction";
import {Role} from "@prisma/client";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function cookieAdminAuthorizationMiddleware(req: Request, _res: Response, next: NextFunction) :void {
    //----> Get userRole, userName and userId.
    const {isName: userName, userId, userRole} = authenticationHelperFunction(req);

    //----> Check for admin privilege.
    const isAdmin = userRole === Role.Admin;

    //----> Permit or reject user.
    if (!isAdmin) {
        throw catchError(StatusCodes.FORBIDDEN, "You are not allowed to view or perform this action!");
    }

    //----> Move on unto the next middleware.
    return next();
}