import { ResponseMessage } from "../utils/reponseMessage";
import {DonorDetail} from "@prisma/client";
import {donorDetailModel} from "../models/donorDetail.model";
import {StatusCodes} from "http-status-codes";
import {Request, Response} from "express";
import {checkResourceContent} from "../utils/checkResourceContent";

class DonorDetailController {
  ////----> create blood-stat controller.
  async createDonorDetail(req: Request, res: Response) {
    //----> Get the blood-stat payload from request body.
    const donorDetail = req.body as unknown as DonorDetail;

    //----> Get the user-id from the user object on the request object.
    const { id: userId } = req.user;
    donorDetail.userId = userId;

    //----> Store the new-blood-stat data in the database.
    const newDonorDetail = await donorDetailModel.createDonorDetail(
      donorDetail
    );

    //----> send back the response.
    res.status(StatusCodes.CREATED).json(newDonorDetail);
  }

  ////----> Delete blood-stat by id controller.
  async deleteDonorDetailById(req: Request, res: Response) {
    //----> Get the id from request params.
    const { id } = req.params;

    //----> Get the user-id and role from the user object on request object.
    const { id: userId, role } = req.user;

    //----> Delete the blood-stat with the giving id.
    await donorDetailModel.deleteDonorDetailById(id, userId, role);

    //----> send back the response.
    res
      .status(StatusCodes.OK)
      .json(
        new ResponseMessage(
          "DonorDetail has been deleted successfully!",
          "success",
          200
        )
      );
  }

  ////----> Delete blood-stat by id controller.
  async deleteDonorDetailByUserId(req: Request, res: Response) {
    //----> Get the user-id from request params.
    const { userId } = req.params;

    //----> Delete the blood-stat with the giving user-id.
    const donorDetails = await donorDetailModel.deleteDonorDetailByUserId(userId);

      //----> Check for empty content.
      checkResourceContent(donorDetails.count)

      //----> send back the response.
        res
        .status(StatusCodes.OK)
        .json(
            new ResponseMessage(
            "DonorDetail has been deleted successfully!",
             "success",
            200
        )
      );
  }

  ////----> Delete all blood-stats controller.
  async deleteAllDonorDetails(_req: Request, res: Response) {
    //----> Delete all blood stats.
    const donorDetails = await donorDetailModel.deleteAllDonorDetails();

      //----> Check for empty content.
      checkResourceContent(donorDetails.count)

    //----> send back the response.
    res
      .status(StatusCodes.OK)
      .json(
        new ResponseMessage(
          "DonorDetails have been deleted successfully!",
          "success",
          200
        )
      );
  }

  ////----> Edit blood-stat controller.
  async editDonorDetailById(req: Request, res: Response) {
    //----> Get the id from request params.
    const { id } = req.params;

    //----> Get the user-id and role from the user object on request object.
    const { id: userId, role } = req.user;

    //----> Get the blood-stat payload from request body.
    const donorDetailToEdit = req.body as unknown as DonorDetail;
    donorDetailToEdit.userId = userId;

    //----> Edit the blood-stat with the giving id.
    await donorDetailModel.editDonorDetailById(
      id,
      donorDetailToEdit,
      userId,
      role
    );

    //----> send back the response.
    res
      .status(StatusCodes.OK)
      .json(
        new ResponseMessage(
          "DonorDetail has been edited successfully!",
          "success",
          200
        )
      );
  }

  ////----> Fetch all blood-stats controller.
  async getAllDonorDetails(_req: Request, res: Response) {
    //----> Fetch all the blood-stats from database.
    const allDonorDetails = await donorDetailModel.getAllDonorDetails();

      //----> Check for empty content.
      checkResourceContent(allDonorDetails.length);

    //----> Send back the response.
    res.status(StatusCodes.OK).json(allDonorDetails);
  }

  ////----> Fetch one blood-stat by id controller.
  async getDonorDetailById(req: Request, res: Response) {
    //----> Get the id from request params.
    const { id } = req.params;

    //----> Get the user-id and role from the user object on request object.
    const { id: userId, role } = req.user;

    //----> Fetch the blood-stat with the giving id.
    const donorDetail = await donorDetailModel.getDonorDetailById(
      id,
      userId,
      role
    );

    //----> Send back the response.
    res.status(StatusCodes.OK).json(donorDetail);
  }

  ////----> Fetch one blood-stat by id controller.
  async getDonorDetailByUserId(req: Request, res: Response) {
    //----> Get the id from request params.
    const { userId } = req.params;

    //----> Fetch the blood-stat with the giving id.
    const donorDetails = await donorDetailModel.getDonorDetailByUserId(userId);

      //----> Check for empty content.
      checkResourceContent(donorDetails.length)

    //----> Send back the response.
    res.status(StatusCodes.OK).json(donorDetails);
  }
}

export const donorDetailController = new DonorDetailController();
