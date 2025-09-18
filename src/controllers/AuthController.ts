import {Role} from "../models/role.model";
import * as jwt from "jsonwebtoken";
import {AuthModel} from "../models/auth.model";
import {Request, Response} from "express"
import {ChangePasswordDto} from "../dto/changePassword.dto";
import {StatusCodes} from "http-status-codes";
import {EditProfileDto} from "../dto/editProfile.dto";
import {LoginDto} from "../dto/login.dto";
import {ResponseMessage} from "../utils/reponseMessage";
import {SignupDto} from "../dto/signup.dto";

class AuthController {

    constructor(public authModel: AuthModel) {
    }

    async changePassword(req: Request, res: Response) {
        //----> Get the change-password payload from request.
        const changePasswordDto = req.body as ChangePasswordDto;

        //----> Change the password in the database.
        const response =await this.authModel.changePassword(changePasswordDto);

        //----> send back the response.
        res.status(StatusCodes.OK).json(response);
    }

    async editProfile(req: Request, res: Response) {
        //----> Get the edit-profile payload from request.
        const editProfileDto = req.body as EditProfileDto;

        //----> Edit-profile in the database.
        const response = await this.authModel.editProfile(editProfileDto);

        //----> Send back the response.
        res.status(StatusCodes.OK).json(response);
    }

    async login(req: Request, res: Response) {
        //----> Get the login payload from request.
        const loginDto = req.body as LoginDto;

        //----> Login the user.
        const user = await this.authModel.login(loginDto);

        //----> Get access-token and refresh-token.
        const accessToken = await this.generateAccessToken(user.id, user.name, user.email, user.role);
        const refreshToken = await this.generateRefreshTokenToken(user.id, user.name, user.email, user.role);

        //----> store both the access-token and refresh-token.
        res.cookie('accessToken', JSON.stringify(accessToken),  { httpOnly: true, secure: false , path: "/", maxAge: new Date().getMinutes() + 15});
        res.cookie('refreshToken', JSON.stringify(refreshToken),  { httpOnly: true, secure: false , path: "/api/auth/refreshToken", maxAge: new Date().getDay() + 7});

        //----> Send back the response.
        res.status(StatusCodes.OK).json(new ResponseMessage("Login is successfully!", "success", 200));

    }

    async signUp(req: Request, res: Response) {
        //----> Get the sign-up payload from request.
        const signUp = req.body as SignupDto;

        //----> Register the user and store his/her data in the database.
        const response = await this.authModel.signup(signUp);

        //----> Send back the response.
        res.status(StatusCodes.CREATED).json(response);
    }


    private async generateAccessToken(id: string, name: string, email: string, role: Role){
        const expiresIn = new Date().getMinutes() + 15;

        return await this.generateToken(id, name, email, role, expiresIn);
    }

    private async generateRefreshTokenToken(id: string, name: string, email: string, role: Role){
        const expiresIn = new Date().getDay() + 7;

        return await this.generateToken(id, name, email, role, expiresIn);
    }

    private async generateToken(id: string, name: string, email: string, role: Role, expiresIn: number){
        return jwt.sign(
            {
                id,
                name,
                role,
                email
            },
            process.env.JWT_TOKEN_KEY!,
            {expiresIn: expiresIn}
        );
    }
}

export const authController = new AuthController(new AuthModel());