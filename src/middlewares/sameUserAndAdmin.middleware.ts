import {NextFunction, Request, Response} from "express";
import {Role} from "@prisma/client";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";


export function sameUserAndAdminMiddleware(req : Request, res: Response, next: NextFunction) {
    //----> Get the user-id from request params.
    const {id : userId} = req.params;

    //----> Get the id and role of user from the user object on request object.
    const {id, role} = req.user;

    const isSameUser = checkForSameUser(userId, id);

    //----> Check for admin privilege.
    const isAdmin = role === Role.Admin;

    //----> Not admin and not same user, reject request.
    if (!isSameUser && !isAdmin) {
        catchError(StatusCodes.FORBIDDEN, "You don't have permission to perform this action.");
    }

    //----> It is either admin or same user, accept request.
    return next();
}

function checkForSameUser(idFromParams: string, idFromUserRequest: string){
    return idFromParams.normalize() === idFromUserRequest.normalize();
}