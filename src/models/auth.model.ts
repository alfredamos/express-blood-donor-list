import prisma from "../db/prisma.db";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import * as bcrypt from "bcryptjs";
import {ResponseMessage} from "../utils/reponseMessage"
import {ChangePasswordDto} from "../dto/changePassword.dto";
import {EditProfileDto} from "../dto/editProfile.dto";
import {LoginDto} from "../dto/login.dto";
import {SignupDto} from "../dto/signup.dto";
import {tokenModel} from "./token.model";
import {validateUserToken} from "../utils/validateUserToken";
import {toUserDto} from "../utils/toDto";


class AuthModel {
  ////----> Change-password function.
  async changePassword(request: ChangePasswordDto): Promise<ResponseMessage> {
    //---> Destructure request.
    const { email, password, newPassword } = request;

    delete request.confirmPassword;

    //----> Check for existence of user.
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
        throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }

    //----> Compare raw password with the one in the database.
    if (!await this.checkForValidPassword(password, user.password)) {
        throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }

    //----> Hash and store new password into the database.
    user.password = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({where: {email}, data: {...user}});

    //----> Send back the response
    return new ResponseMessage("Password is changed successfully", "success", 200)

  }

  ////----> Edit user profile function.
  async editUserProfile(request: EditProfileDto) {
      //----> Destructure email and password.
      const { email, password } = request;

      //----> Check for existence of user.
      const user = await prisma.user.findUnique({where: {email}}) ;
      if (!user) {
          throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
      }

      //----> Check for valid password.
      if (!await this.checkForValidPassword(password, user.password)) {
          throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
      }

      //----> Re hash the password.
      request.password = await bcrypt.hash(password, 12);

      //----> Calculate the age.
      const calcAge = new Date()?.getFullYear() - new Date(request.dateOfBirth)?.getFullYear();

      //----> Check for dateOfBirth input.
      const isoDate = new Date(request.dateOfBirth)?.toISOString()


      //----> save the changes in the database.
      await prisma.user.update({where: {email}, data: {...request, id: user.id, role: user.role, age: !!calcAge? calcAge : user.age, dateOfBirth: !!isoDate? isoDate : user.dateOfBirth}});

      //----> Send back the response
      return new ResponseMessage("Profile is edited successfully", "success", 200)

  }

  ////----> Login user function.
  async loginUser(request: LoginDto) {
      //----> Destructure email and password from request.
      const { email, password } = request;

      //----> Check for existence of user.
      const user = await prisma.user.findUnique({where: {email}});

      if (!user) {
          throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
      }

      //----> Check for valid password.
      if (!await this.checkForValidPassword(password, user.password)) {
          throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
      }

      //----> send back response.
      return user

  }

  ////----> Fetch the current-user function.
  async getCurrentUser(userId: string) {
      return toUserDto(await prisma.user.findUnique({where: {id: userId}}));
  }

  ////----> Signup new user function.
  async signupUser(request: SignupDto){
      console.log("In signup of model : signup" , request);
      //----> destructure email, password, confirm-password from request.
      const { email, password } = request;

      delete request.confirmPassword;

      //----> Check for existence of user.
      const user = await prisma.user.findUnique({where: {email}}) ;
      if (!!user) {
          throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
      }

      //----> Hash password.
      request.password = await bcrypt.hash(password, 12);

      //----> Remove confirm-password and save the rest in the database.
      const {confirmPassword : passwordConfirm, ...rest} = request;

      //----> Calculate the age.
      const age = new Date()?.getFullYear() - new Date(rest.dateOfBirth)?.getFullYear()

      //----> Insert the new user in the database and send back the result.
      await prisma.user.create({data: {...rest, age, dateOfBirth: new Date(rest.dateOfBirth).toISOString()}});

      //----> Send back the response.
      return new ResponseMessage("Signup is successfully", "success", 200)
  }

  ////----> Refresh token function.
  async refreshUserToken(refreshToken: string){
      //----> Parse the refresh-token and check for validity of token.
      const tokenResult = validateUserToken(refreshToken)

      //----> Get the last valid token and check its validity.
      const validToken = (await tokenModel.findAllValidTokensByUser(tokenResult.id)).find(token => token.refreshToken && tokenResult.id);
      if (!validToken) {
          throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
      }

      //----> Revoked all tokens.
      await tokenModel.revokedAllUserTokens(tokenResult.id);

      //----> Send back the results.
      return tokenResult;

  }


  ////----> Check for valid user password by comparing the user supplied password with the one in the database.
  private async checkForValidPassword(rawPassword: string, hashedPassword: string){
      return await bcrypt.compare(rawPassword, hashedPassword);
  }

}

export const authModel = new AuthModel();
