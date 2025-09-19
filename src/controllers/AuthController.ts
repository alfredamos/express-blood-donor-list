import * as jwt from "jsonwebtoken";
import {authModel} from "../models/auth.model";
import {Request, Response} from "express"
import {ChangePasswordDto} from "../dto/changePassword.dto";
import {StatusCodes} from "http-status-codes";
import {EditProfileDto} from "../dto/editProfile.dto";
import {LoginDto} from "../dto/login.dto";
import {SignupDto} from "../dto/signup.dto";
import {Role, Token} from "@prisma/client";
import {CookieParams} from "../utils/cookieParams";
import {tokenModel} from "../models/token.model";
import {TokenType} from "../models/tokenType.model";
import {getCookie} from "../utils/getcookie";
import {validateUserToken} from "../utils/validateUserToken";
import prisma from "../db/prisma.db";
import {ResponseMessage} from "../utils/reponseMessage";

class AuthController {

    async changePassword(req: Request, res: Response) {
        //----> Get the change-password payload from request.
        const changePasswordDto = req.body as ChangePasswordDto;

        //----> Change the password in the database.
        const response = await authModel.changePassword(changePasswordDto);

        //----> send back the response.
        res.status(StatusCodes.OK).json(response);
    }

    async editUserProfile(req: Request, res: Response) {
        //----> Get the edit-profile payload from request.
        const editProfileDto = req.body as EditProfileDto;

        //----> Edit-profile in the database.
        const response = await authModel.editUserProfile(editProfileDto);

        //----> Send back the response.
        res.status(StatusCodes.OK).json(response);
    }

    async loginUser(req: Request, res: Response) {
        //----> Get the login payload from request.
        const loginDto = req.body as LoginDto;

        //----> Login the user.
        const user = await authModel.loginUser(loginDto);

        console.log("login-user-controller, user : ", user);

        //----> Revoked all previous tokens.
        await tokenModel.revokedAllUserTokens(user?.id)

        //----> generate access-token and refresh-token, store them in cookies, make token object and store it in database.
        const accessToken = await generateTokensAndCookies(user?.id, user?.name, user?.email, user?.role, res);

        //----> Send back the response.
        res.status(StatusCodes.OK).json( accessToken);

    }

    async logoutUser(req: Request, res: Response) {
        //----> Get the current access-token.
        const accessToken = getCookie(req, CookieParams.accessToken)

        //----> Get the first valid token.
        const storedAccessToken = await tokenModel.findByAccessToken(accessToken);

        //----> Invalidate the tokens by setting expire and revoke to true.
        if (!!storedAccessToken) {
            storedAccessToken.expired = true;
            storedAccessToken.revoked = true;

            await prisma.token.update({where: {accessToken: storedAccessToken.accessToken}, data: {...storedAccessToken}});
        }

        //----> Invalidate both the access-token and refresh-token.
        makeCookie(res, CookieParams.accessToken, JSON.stringify(accessToken), CookieParams.accessTokenPath,0);
        //makeCookie(res, CookieParams.refreshToken, JSON.stringify(refreshToken), CookieParams.refreshTokenPath,0)

        //----> send back the response.
        res.status(StatusCodes.OK).json( new ResponseMessage("Logout is successful!", "successful", 200) );
    }

    async signUpUser(req: Request, res: Response) {
        //----> Get the sign-up payload from request.
        const signUp = req.body as SignupDto;

        console.log("In signup of controller : signup" , signUp);

        //----> Register the user and store his/her data in the database.
        const response = await authModel.signupUser(signUp);

        //----> Send back the response.
        res.status(StatusCodes.CREATED).json(response);
    }

    async refreshUserToken(req: Request, res: Response) {
        //----> Get refresh-token.
        const refreshToken = getCookie(req, CookieParams.refreshToken);

        //----> Parse refresh-token, get valid token object and check its validity and revoked all valid tokens for this user.
        const tokenResponse = await authModel.refreshUserToken(refreshToken);

        //----> generate access-token and refresh-token, store them in cookies, make token object and store it in database.
        const accessToken = await generateTokensAndCookies(tokenResponse?.id, tokenResponse?.name, tokenResponse?.email, tokenResponse?.role, res);

        //----> Send back the response.
        res.status(StatusCodes.OK).json( accessToken);
    }

}

const generateTokensAndCookies = async(userId: string, userName: string, userEmail: string, userRole: Role, res: Response) =>{
    //----> Get access-token and refresh-token.
    const accessToken = await generateAccessToken(userId, userName, userEmail, userRole);
    const refreshToken = await generateRefreshTokenToken(userId, userName, userEmail, userRole);

    //----> store both the access-token and refresh-token in the cookie.
    res.cookie(CookieParams.accessToken, JSON.stringify(accessToken), {
        httpOnly: true,
        secure: false,
        path: CookieParams.accessTokenPath,
        maxAge: CookieParams.accessTokenMaxAge
    });
    res.cookie(CookieParams.refreshToken, JSON.stringify(refreshToken), {
        httpOnly: true,
        secure: false,
        path: CookieParams.refreshTokenPath,
        maxAge: CookieParams.refreshTokenMaxAge
    });

    //----> Make a new token object and store it in the database.
    const newToken = makeToken(accessToken, refreshToken, userId);
    await tokenModel.createToken(newToken);
    return accessToken;
}

const makeCookie = (res: Response, cookieName: string, cookieValue: string, cookiePath: string, maxAge: number) => {
    res.cookie(cookieName, cookieValue, {
        httpOnly: true,
        secure: false,
        path: cookiePath,
        maxAge
    })
}

const makeToken = (accessToken: string, refreshToken: string, userId: string) : Token =>{
    return {
        id: crypto.randomUUID(),
        accessToken,
        refreshToken,
        expired: false,
        revoked: false,
        tokenType: TokenType.Bearer,
        userId
    }
}

const generateAccessToken = async (id: string, name: string, email: string, role: Role) =>{
    //----> Expires is for one day, which is equal 24 * 60 * 60 * 1000 milliseconds
    return generateTokenToken(id, name, email, role, 24 * 60 * 60 * 1000)
}

const generateRefreshTokenToken = async (id: string, name: string, email: string, role: Role)=>{
    //----> Expires is for seven days, which is equal 7 * 24 * 60 * 60 * 1000 milliseconds
    return generateTokenToken(id, name, email, role, 7 * 24 * 60 * 60 * 1000)

}

const generateTokenToken = async (id: string, name: string, email: string, role: Role, expiresIn: number)=>{
    return jwt.sign(
        {
            id,
            name,
            role,
            email
        },
        process.env.JWT_TOKEN_KEY!,
        {expiresIn}
    );
}



export const authController = new AuthController();
