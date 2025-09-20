import {BloodStat} from "@prisma/client";
import {bloodStatModel} from "../models/bloodstat.model";
import {StatusCodes} from "http-status-codes";
import {Request, Response} from "express";
import {ResponseMessage} from "../utils/reponseMessage";

class BloodStatController{
    ////----> create blood-stat controller.
    async createBloodStat(req: Request, res: Response){
        //----> Get the blood-stat payload from request body.
        const bloodStat = req.body as unknown as BloodStat;

        //----> Get the user-id from the user object on the request object.
        const {id: userId} = req.user;
        bloodStat.userId = userId;

        //----> Store the new-blood-stat data in the database.
        const newBloodStat = await bloodStatModel.createBloodStat(bloodStat);

        //----> send back the response.
        res.status(StatusCodes.CREATED).json(newBloodStat);
    }

    ////----> Delete blood-stat by id controller.
    async deleteBloodById(req: Request, res: Response){
        //----> Get the id from request params.
        const {id} = req.params;

        //----> Get the user-id and role from the user object on request object.
        const {id: userId, role} = req.user;

        //----> Delete the blood-stat with the giving id.
        await bloodStatModel.deleteBloodStatById(id, userId, role);

        //----> send back the response.
        res.status(StatusCodes.OK).json(new ResponseMessage("BloodStat has been deleted successfully!", "success", 200));

    }

    ////----> Delete blood-stat by id controller.
    async deleteBloodByUserId(req: Request, res: Response){
        //----> Get the user-id from request params.
        const {userId} = req.params;

        //----> Delete the blood-stat with the giving user-id.
        await bloodStatModel.deleteBloodStatByUserId(userId);

        //----> send back the response.
        res.status(StatusCodes.OK).json(new ResponseMessage("BloodStat has been deleted successfully!", "success", 200));

    }

    ////----> Delete all blood-stats controller.
    async deleteAllBloodStats(_req: Request, res: Response){
        //----> Delete all blood stats.
        await bloodStatModel.deleteAllBloodStats();

        //----> send back the response.
        res.status(StatusCodes.OK).json(new ResponseMessage("BloodStats have been deleted successfully!", "success", 200));

    }

    ////----> Edit blood-stat controller.
    async editBloodStatById(req: Request, res: Response){
        //----> Get the id from request params.
        const {id} = req.params;

        //----> Get the user-id and role from the user object on request object.
        const {id: userId, role} = req.user;

        //----> Get the blood-stat payload from request body.
        const bloodStatToEdit = req.body as unknown as BloodStat;
        bloodStatToEdit.userId = userId;

        //----> Edit the blood-stat with the giving id.
        await bloodStatModel.editBloodStatById(id, bloodStatToEdit, userId, role);

        //----> send back the response.
        res.status(StatusCodes.OK).json(new ResponseMessage("BloodStat has been edited successfully!", "success", 200));

    }

    ////----> Fetch all blood-stats controller.
    async getAllBloodStats(_req: Request, res: Response){
        //----> Fetch all the blood-stats from database.
        const allBloodStats = await bloodStatModel.getAllBloodStats();

        //----> Send back the response.
        res.status(StatusCodes.OK).json(allBloodStats);
    }

    ////----> Fetch one blood-stat by id controller.
    async getBloodStatById(req: Request, res: Response){
        //----> Get the id from request params.
        const {id} = req.params;

        //----> Get the user-id and role from the user object on request object.
        const {id: userId, role} = req.user;

        //----> Fetch the blood-stat with the giving id.
        const bloodStat = await bloodStatModel.getBloodStatById(id, userId, role);

        //----> Send back the response.
        res.status(StatusCodes.OK).json(bloodStat);
    }

    ////----> Fetch one blood-stat by id controller.
    async getBloodStatByUserId(req: Request, res: Response){
        //----> Get the id from request params.
        const {userId} = req.params;

        //----> Fetch the blood-stat with the giving id.
        const bloodStat = await bloodStatModel.getBloodStatByUserId(userId);

        //----> Send back the response.
        res.status(StatusCodes.OK).json(bloodStat);
    }


}

export const bloodStatController = new BloodStatController()