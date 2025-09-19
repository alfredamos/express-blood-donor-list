import {Request,} from "express";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function getCookie(req: Request, tokenName: string) {
    try{
        return JSON.parse(req.cookies[tokenName]);
    }catch(err){
        throw catchError(StatusCodes.UNAUTHORIZED, "You do not have a valid token!");
    }

}