import {BloodStat, Role} from "@prisma/client";
import prisma from "../db/prisma.db";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {checkForOwnershipAndAdmin} from "../utils/checkForOwnershipAndAdmin";

class BloodStatModel {

    ////----> Create blood-stat function.
    async createBloodStat(bloodStat: BloodStat){
      //----> Get the user-id on blood-stat.
      const userId = bloodStat.userId;
      const fetchedBloodStat = await this.getBloodStatByUserId(userId);

      //----> Check for existence of blood-stat for this user.
      if (fetchedBloodStat){
        throw catchError(StatusCodes.BAD_REQUEST, "You already have blood-stat, you are only allowed to edit!")
      }

      //----> Insert the blood-stat into the database
      return prisma.bloodStat.create({ data: bloodStat });
    }

    ////----> Delete blood-stat by id function.
    async deleteBloodStatById(id: string, userId: string, role: Role){
        //----> Fetch the blood-stat and the user-id.
        const {userId: userIdOnBloodStat} = await this.getOneBloodStatById(id)

        //----> Check for ownership or admin.
        checkForOwnershipAndAdmin(userId, userIdOnBloodStat, role)

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
        //----> Fetch all blood-stats.
        const allBloodStats = await prisma.bloodStat.findMany({});
        const allBloodStatIds = allBloodStats.map(bloodStat => bloodStat.id);

        //----> Delete all blood-stats and send back response.
        await prisma.bloodStat.deleteMany({
            where: {
                id:{
                    in: allBloodStatIds,
                },
            },
        })
    }

    ////----> Edit blood-stat function.
    async editBloodStatById(id: string, bloodStat: BloodStat, userId: string, role: Role){
        //----> Fetch the blood-stat and the user-id.
        const {userId: userIdOnBloodStat} = await this.getOneBloodStatById(id)

        //----> Check for ownership or admin.
        checkForOwnershipAndAdmin(userId, userIdOnBloodStat, role)

        //----> Update the blood-stat.
        return prisma.bloodStat.update({where:{id}, data: {...bloodStat}})

    }

    ////----> Fetch all blood-stats function.
    async getAllBloodStats(){
        return prisma.bloodStat.findMany({})
    }

    ////----> Fetch one blood-stat by id function.
    async getBloodStatById(id: string, userId: string, role: Role){
        //----> Fetch the blood-stat and the user-id.
        const {userId: userIdOnBloodStat, bloodStat} = await this.getOneBloodStatById(id)

        //----> Check for ownership or admin.
        checkForOwnershipAndAdmin(userId, userIdOnBloodStat, role);

        //----> Send back the result.
        return bloodStat
    }

    ////----> Fetch one blood-stat by id function.
    async getBloodStatByUserId(userId: string){

        //----> Fetch the blood-stat that matches the giving user-id.
        return this.existBloodStatByUserId(userId);

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

    getOneBloodStatById = async (id: string) =>{
        //----> Get one blood-stat with given id from database.
        const bloodStat = await prisma.bloodStat.findUnique({where: {id}});

        //----> Check for existence.
        if (!bloodStat){
            throw catchError(StatusCodes.NOT_FOUND, `The bloodStat with id ${id} does not exist`);
        }

        const userId = bloodStat.userId;

        //----> send back result.
        return {bloodStat, userId};
    }


}

export const bloodStatModel = new BloodStatModel();