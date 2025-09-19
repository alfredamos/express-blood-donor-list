import {Request} from "express";
import {validateUserToken} from "../utils/validateUserToken";
import {getCookie} from "../utils/getcookie";
import {CookieParams} from "../utils/cookieParams";

export function authenticationHelperFunction(req: Request)  {
    //----> Get access-token
    const accessToken = getCookie(req, CookieParams.accessToken);

    //----> Verify token
    const jwtToken = validateUserToken(accessToken);

    //----> Get the role, name, and id of user from the token object.
    const userRole = jwtToken?.role;
    const isName = jwtToken?.name;
    const userId = jwtToken?.id;
    const email = jwtToken?.email;

    //----> Send back the results.
    return {userId, userRole, isName, email}
}