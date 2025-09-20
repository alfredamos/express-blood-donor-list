import {Gender} from "./gender.model";
import prisma from "../db/prisma.db";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {checkForOwnershipAndAdmin} from "../utils/checkForOwnershipAndAdmin";
import {Role} from "@prisma/client";

class UserModel{
    ////----> Delete user function.
    async deleteUserById(id:string, userId:string, role: Role){
        await this.getOneUser(id);

        //----> Check for ownership or admin.
        checkForOwnershipAndAdmin(userId, id, role);

        //----> Delete the user with the giving id.
        return prisma.user.delete({where:{id}})
    }

    ////----> Fetch one user from database by id function.
    async getUserById(id:string, userId:string, role:Role){
        //----> Fetch the user with the giving id.
        const user = await this.getOneUser(id);

        //----> Check for same user and admin privilege.
        checkForOwnershipAndAdmin(userId, id, role);

        //----> Send back result.
        return user;
    }

    ////----> Get all users from database function.
    async getAllUsers(){
        //----> Fetch all the users from database.
        return prisma.user.findMany({});
    }

    ////----> Get one user to fetch one user from database.
    private async getOneUser(userId:string){
        //----> Fetch the user fom database.
        const user = await prisma.user.findUnique({where:{id:userId}});

        //----> Check for existence.
        if (!user){
            throw catchError(StatusCodes.NOT_FOUND, `User with id ${userId} not found in the database`);
        }

        //----> Send back the result.
        return user;
    }

}

export const userModel = new UserModel();