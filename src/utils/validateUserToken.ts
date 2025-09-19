import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import * as jwt from "jsonwebtoken";
import {TokenJwt} from "./tokenJwt";

export function validateUserToken(token: string) {
    //----> Check for empty token.
    if(!token) {
        throw catchError(
            StatusCodes.UNAUTHORIZED,
            "Invalid credentials!"
        );
    }

    //----> Verify the jwt-token
    try {
        return jwt?.verify(token, process.env.JWT_TOKEN_KEY!) as TokenJwt;
    }catch(err) {
        throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }

}