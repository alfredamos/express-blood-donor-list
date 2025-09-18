import prisma from "../db/prisma.db";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {ResponseMessage} from "../utils/reponseMessage"
import {ChangePasswordDto} from "../dto/changePassword.dto";
import {EditProfileDto} from "../dto/editProfile.dto";
import {LoginDto} from "../dto/login.dto";
import {SignupDto} from "../dto/signup.dto";
import {Role} from "./role.model";
import {UserModel} from "./user.model";


export class AuthModel {

  async changePassword(request: ChangePasswordDto): Promise<ResponseMessage> {
    //---> Destructure request.
    const { email, password, confirmPassword, newPassword } = request;

    //----> Check for match between new-password and confirm-password.
    if (!this.checkPasswordMatch(confirmPassword, newPassword)) {
      throw catchError(StatusCodes.BAD_REQUEST, "Password must match!");
    }

    //----> Check for existence of user.
    const user = await prisma.User.findUnique({where: {email}});
    if (!user) {
        throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }

    //----> Compare raw password with the one in the database.
    if (!await this.checkForValidPassword(password, user.password)) {
        throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
    }

    //----> Hash and store new password into the database.
    user.password = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({where: {email}, data: {user}});

    //----> Send back the response
    return new ResponseMessage("Password is changed successfully", "success", 200)

  }

  async editProfile(request: EditProfileDto) {
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

      //----> save the changes in the database.
      await prisma.user.update({where: {email}, data: {request, role: user.role, age: new Date().getFullYear() - request.dateOfBirth.getFullYear()}});

      //----> Send back the response
      return new ResponseMessage("Profile is edited successfully", "success", 200)

  }

  async login(request: LoginDto) {
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

  async signup(request: SignupDto){
      //----> destructure email, password, confirm-password from request.
      const { email, password, confirmPassword } = request;

      //----> Check for match between password and confirm-password
      if (!this.checkPasswordMatch(password, confirmPassword)) {
          throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
      }

      //----> Check for existence of user.
      const user = await prisma.user.findUnique({where: {email}}) ;
      if (!!user) {
          throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
      }

      //----> Hash password.
      request.password = await bcrypt.hash(password, 12);

      //----> Remove confirm-password and save the rest in the database.
      const {confirmPassword : passwordConfirm, ...rest} = request;

      //----> Insert the new user in the database and send back the result.
      await prisma.user.create({data: {rest}})

      //----> Send back the response.
      return new ResponseMessage("Signup is successfully", "success", 200)
  }

  private checkPasswordMatch(password : string, confirmPassword : string): boolean {
      return password.normalize() === confirmPassword.normalize();
  }

  private async checkForValidPassword(rawPassword: string, hashedPassword: string){
      return await bcrypt.compare(rawPassword, hashedPassword);
  }


}
