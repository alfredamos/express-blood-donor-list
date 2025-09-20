import { Role, Vital } from "@prisma/client";
import prisma from "../db/prisma.db";
import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import {checkForOwnershipAndAdmin} from "../utils/checkForOwnershipAndAdmin";

class VitalModel {
  ////----> Create vital function.
  async createVital(vital: Vital) {
    //----> Calculate the bmi.
    const bmi = (Number(vital.weight))/(Number(vital.height) * Number(vital.height));

    return prisma.vital.create({ data: {...vital, bmi} });
  }

  ////----> Delete vital by id function.
  async deleteVitalById(id: string, userId: string, role: Role) {
    //----> Fetch the donor-detail and user-id.
    const {userId: userIdOnVital, vital} = await this.existVitalId(id);

    //----> Check for ownership or admin.
    checkForOwnershipAndAdmin(userId, userIdOnVital, role);

    //----> Delete the vital.
    return prisma.vital.delete({ where: { id } });
  }

  ////----> Delete vital user-id function.
  async deleteVitalByUserId(userId: string) {
    //----> Delete the donor-detail.
    return prisma.vital.deleteMany({where: {userId}});
  }

  ////----> Delete all vitals.
  async deleteAllVitals() {
    //----> Fetch all vitals from database.
    const allVitals = await prisma.vital.findMany({});
    const allVitalIds = allVitals.map(vital => vital.id);
    //----> Delete all donor-details and send back response.
    return prisma.vital.deleteMany({
        where: {
            id:{
                in: allVitalIds
            },

        },
    });
  }

  ////----> Edit donor-detail function.
  async editVitalById(
    id: string,
    vital: Vital,
    userId: string,
    role: Role
  ) {
      //----> Fetch the donor-detail and user-id.
      const {userId: userIdOnVital} = await this.existVitalId(id);

      //----> Calculate the bmi.
      const bmi = (Number(vital.weight))/(Number(vital.height) * Number(vital.height));

      //----> Check for ownership or admin.
      checkForOwnershipAndAdmin(userId, userIdOnVital, role);

    //----> Update the donor-detail.
    return prisma.vital.update({
      where: { id },
      data: { ...vital, bmi },
    });
  }

  ////----> Fetch all donor-details function.
  async getAllVitals() {
    return prisma.vital.findMany({});
  }

  ////----> Fetch one donor-detail by id function.
  async getVitalById(id: string, userId: string, role: Role) {
      //----> Fetch the donor-detail and user-id.
      const {userId: userIdOnVital, vital} = await this.existVitalId(id);

      //----> Check for ownership or admin.
      checkForOwnershipAndAdmin(userId, userIdOnVital, role);

      //----> Send back result.
      return vital;
  }

  ////----> Fetch one donor-detail by id function.
  async getVitalByUserId(userId: string) {
    //----> Fetch the donor-detail that matches the giving user-id.
    return prisma.vital.findMany({ where: { userId: userId } });
  }

  ////----> Fetch and check existence of donor-detail by id function.
  private existVitalId = async (id: string) => {
    //----> Check for existence of the donor-detail with giving id.
    const vital = await prisma.vital.findUnique({ where: { id } });
    if (!vital) {
      throw catchError(
        StatusCodes.NOT_FOUND,
        `The vital with id ${id} does not exist`
      );
    }

    //----> Get the user-id.
    const userId = vital.userId

    //----> Send back the response
    return {vital, userId};
  };

}

export const vitalModel = new VitalModel();
