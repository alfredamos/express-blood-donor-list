import {Role} from "@prisma/client";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {UuidTool} from "uuid-tool";

export function checkForOwnershipAndAdmin(
    userIdFromParam: string,
    userIdFromResource: string,
    role: Role
){
    //----> compare the user-id fom param with the user-id on the resource.
    const isSameUser = UuidTool.compare(userIdFromParam, userIdFromResource)

    //----> Check for admin privilege.
    const isAdmin = role === Role.Admin;

    //----> Not same user and not admin, reject request.
    if (!isSameUser && !isAdmin) {
        throw catchError(
            StatusCodes.FORBIDDEN,
            "You are not allowed to view or perform this action!"
        );
    }

};