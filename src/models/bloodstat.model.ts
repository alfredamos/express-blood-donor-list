import {BloodStat, Role} from "@prisma/client";
import prisma from "../db/prisma.db";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

class BloodStatModel {

    ////----> Create blood-stat function.
    async createBloodStat(bloodStat: BloodStat){
        return prisma.bloodStat.create({data: bloodStat});
    }

    ////----> Delete blood-stat by id function.
    async deleteBloodStatById(id: string, userId: string, role: Role){
        //----> Check for ownership or admin.
        await this.checkForOwnershipAndAdmin(id, userId, role);

        //----> Delete the blood-stat.
        return prisma.bloodStat.delete({where: {id}});

    }

    ////----> Delete blood-stat user-id function.
    async deleteBloodStatByUserId(userId: string){
        //----> Check for existence of the blood-stat with giving id.
        await this.existBloodStatByUserId(userId);

        //----> Delete the blood-stat.
        return prisma.bloodStat.delete({where: {userId}});

    }

    ////----> Delete all blood-stats.
    async deleteAllBloodStats(){
        //----> Delete all blood-stats and send back response.
        prisma.bloodStat.deleteMany({})
    }

    ////----> Edit blood-stat function.
    async editBloodStatId(id: string, bloodStat: BloodStat, userId: string, role: Role){
        //----> Check for ownership or admin.
        await this.checkForOwnershipAndAdmin(id, userId, role);

        //----> Update the blood-stat.
        return prisma.bloodStat.update({where:{id}, data: {...bloodStat}})

    }

    ////----> Fetch all blood-stats function.
    async getAllBloodStats(){
        return prisma.bloodStat.findMany({})
    }

    ////----> Fetch one blood-stat by id function.
    async getBloodStatById(id: string, userId: string, role: Role){
        //----> Check for ownership or admin.
        return await this.checkForOwnershipAndAdmin(id, userId, role);
    }

    ////----> Fetch one blood-stat by id function.
    async getBloodStatByUserId(userId: string){
        //----> Fetch the blood-stat that matches the giving user-id.
        return this.existBloodStatByUserId(userId);

    }

    ////----> Fetch and check existence of blood-stat by id function.
    private existBloodStatId = async (id: string) =>{
        //----> Check for existence of the blood-stat with giving id.
        const bloodStat = await prisma.bloodStat.findUnique({where: {id}});;
        if (!bloodStat){
            throw catchError(StatusCodes.NOT_FOUND, `The bloodStat with id ${id} does not exist`);
        }

        //----> Send back the response
        return bloodStat;
    }

    ////----> Fetch and check existence of blood-stat by user-id function.
    private existBloodStatByUserId = async (userId: string) =>{
        //----> Check for existence of the blood-stat with giving id.
        const bloodStat = await prisma.bloodStat.findUnique({where: {userId}});;
        if (!bloodStat){
            throw catchError(StatusCodes.NOT_FOUND, `The bloodStat with userId ${userId} does not exist`);
        }

        //----> Send back the response
        return bloodStat;
    }

     checkForOwnershipAndAdmin = async (id: string, userId: string, role: Role) =>{
        const bloodStat = await this.existBloodStatId(id);

        //----> compare the user-id on blood-stat with the user-id on the user on the request object.
        const isSameUser = bloodStat.userId === userId;

        //----> Check for admin privilege.
         const isAdmin = role === Role.Admin;

         //----> Not same user and not admin, reject request.
         if (!isSameUser && !isAdmin){
             throw catchError(StatusCodes.FORBIDDEN, "You are not allowed to view or perform this action!")
         }

         //----> Either same user or admin, accept request.

         return bloodStat;

    }


}

export const bloodStatModel = new BloodStatModel();