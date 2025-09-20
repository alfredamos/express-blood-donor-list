import { StatusCodes } from "http-status-codes";
import { vitalModel } from "../models/vital.model";
import { Request, Response } from "express";
import {ResponseMessage} from "../utils/reponseMessage";
import {Vital} from "@prisma/client";
import {checkResourceContent} from "../utils/checkResourceContent";

class VitalController {
  ////----> create blood-stat controller.
  async createVital(req: Request, res: Response) {
    //----> Get the blood-stat payload from request body.
    const vital = req.body as unknown as Vital;

    //----> Get the user-id from the user object on the request object.
    const { id: userId } = req.user;
    vital.userId = userId;

    //----> Store the new-blood-stat data in the database.
    const newVital = await vitalModel.createVital(vital);

    //----> send back the response.
    res.status(StatusCodes.CREATED).json(newVital);
  }

  ////----> Delete blood-stat by id controller.
  async deleteBloodById(req: Request, res: Response) {
    //----> Get the id from request params.
    const { id } = req.params;

    //----> Get the user-id and role from the user object on request object.
    const { id: userId, role } = req.user;

    //----> Delete the blood-stat with the giving id.
    await vitalModel.deleteVitalById(id, userId, role);

    //----> send back the response.
    res
      .status(StatusCodes.OK)
      .json(
        new ResponseMessage(
          "Vital has been deleted successfully!",
          "success",
          200
        )
      );
  }

  ////----> Delete blood-stat by id controller.
  async deleteBloodByUserId(req: Request, res: Response) {
    //----> Get the user-id from request params.
    const { userId } = req.params;

    //----> Delete the blood-stat with the giving user-id.
    const vitals = await vitalModel.deleteVitalByUserId(userId);

      //----> Check for empty content.
      checkResourceContent(vitals.count)

    //----> send back the response.
    res
      .status(StatusCodes.OK)
      .json(
        new ResponseMessage(
          "Vital has been deleted successfully!",
          "success",
          200
        )
      );
  }

  ////----> Delete all blood-stats controller.
  async deleteAllVitals(_req: Request, res: Response) {
    //----> Delete all blood stats.
    const allVitas = await vitalModel.deleteAllVitals();

      //----> Check for empty content.
      checkResourceContent(allVitas.count)

    //----> send back the response.
    res
      .status(StatusCodes.OK)
      .json(
        new ResponseMessage(
          "Vitals have been deleted successfully!",
          "success",
          200
        )
      );
  }

  ////----> Edit blood-stat controller.
  async editVitalById(req: Request, res: Response) {
    //----> Get the id from request params.
    const { id } = req.params;

    //----> Get the user-id and role from the user object on request object.
    const { id: userId, role } = req.user;

    //----> Get the blood-stat payload from request body.
    const vitalToEdit = req.body as unknown as Vital;
    vitalToEdit.userId = userId;

    //----> Edit the blood-stat with the giving id.
    await vitalModel.editVitalById(id, vitalToEdit, userId, role);

    //----> send back the response.
    res
      .status(StatusCodes.OK)
      .json(
        new ResponseMessage(
          "Vital has been edited successfully!",
          "success",
          200
        )
      );
  }

  ////----> Fetch all blood-stats controller.
  async getAllVitals(_req: Request, res: Response) {
    //----> Fetch all the blood-stats from database.
    const allVitals = await vitalModel.getAllVitals();

      //----> Check for empty content.
      checkResourceContent(allVitals.length)

    //----> Send back the response.
    res.status(StatusCodes.OK).json(allVitals);
  }

  ////----> Fetch one blood-stat by id controller.
  async getVitalById(req: Request, res: Response) {
    //----> Get the id from request params.
    const { id } = req.params;

    //----> Get the user-id and role from the user object on request object.
    const { id: userId, role } = req.user;

    //----> Fetch the blood-stat with the giving id.
    const vital = await vitalModel.getVitalById(id, userId, role);

    //----> Send back the response.
    res.status(StatusCodes.OK).json(vital);
  }

  ////----> Fetch one blood-stat by id controller.
  async getVitalByUserId(req: Request, res: Response) {
    //----> Get the id from request params.
    const { userId } = req.params;

    //----> Fetch the blood-stat with the giving id.
    const vitals = await vitalModel.getVitalByUserId(userId);

      //----> Check for empty content.
      checkResourceContent(vitals.length)

    //----> Send back the response.
    res.status(StatusCodes.OK).json(vitals);
  }
}

export const vitalController = new VitalController();
