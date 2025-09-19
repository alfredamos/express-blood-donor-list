import {NextFunction, Request, Response} from "express"
import {isAuthorizedRole} from "../utils/isAuthorizedUser";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {authenticationHelperFunction} from "./authenticationHelperfunction";

export function cookieAuthenticationMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Get userRole, userName and userId.
    const {isName: userName, userId, userRole, email} = authenticationHelperFunction(req);

    //----> Set the id, name, email and role of user on request object.
    req.user = {id: userId, name : userName, email, role: userRole };


    //----> Check for authorized-user.
    const isAuthorizedUser = isAuthorizedRole(userRole);

    //----> Permit or reject user.
    if (!isAuthorizedUser && !userName && !userId) {
        throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    //----> Move on unto the next middleware.
    return next();

}