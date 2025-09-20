import { DonorDetail, Role } from "@prisma/client";
import prisma from "../db/prisma.db";
import { StatusCodes } from "http-status-codes";
import catchError from "http-errors";
import {checkForOwnershipAndAdmin} from "../utils/checkForOwnershipAndAdmin";

class DonorDetailModel {
  ////----> Create donor-detail function.
  async createDonorDetail(donorDetail: DonorDetail) {
    return prisma.donorDetail.create({ data: donorDetail });
  }

  ////----> Delete donor-detail by id function.
  async deleteDonorDetailById(id: string, userId: string, role: Role) {
    //----> Fetch the donor-detail and user-id.
    const {userId: userIdOnDonorDetail} = await this.existDonorDetailId(id)

    //----> Check for ownership or admin.
    checkForOwnershipAndAdmin(userId, userIdOnDonorDetail, role);

    //----> Delete the donor-detail.
    return prisma.donorDetail.delete({ where: { id } });
  }

  ////----> Delete donor-detail user-id function.
  async deleteDonorDetailByUserId(userId: string) {
    //----> Delete the donor-detail.
    return prisma.donorDetail.deleteMany({ where: { userId } });
  }

  ////----> Delete all donor-details.
  async deleteAllDonorDetails() {
    //----> Fetch all donor-details.
    const allDonorDetails = await prisma.donorDetail.findMany({});
    const allDonorDetailIds = allDonorDetails.map((donorDetail) => donorDetail.id);

    //----> Delete all donor-details and send back response.
    return prisma.donorDetail.deleteMany({
        where: {
            id:{
                in: allDonorDetailIds,
            }
        }
    });
  }

  ////----> Edit donor-detail function.
  async editDonorDetailById(
    id: string,
    donorDetail: DonorDetail,
    userId: string,
    role: Role
  ) {
      //----> Fetch the donor-detail and user-id.
      const {userId: userIdOnDonorDetail} = await this.existDonorDetailId(id)

      //----> Check for ownership or admin.
      checkForOwnershipAndAdmin(userId, userIdOnDonorDetail, role);

    //----> Update the donor-detail.
    return prisma.donorDetail.update({
      where: { id },
      data: { ...donorDetail },
    });
  }

  ////----> Fetch all donor-details function.
  async getAllDonorDetails() {
    //----> Fetch all donor-details.
      return prisma.donorDetail.findMany({});
  }

  ////----> Fetch one donor-detail by id function.
  async getDonorDetailById(id: string, userId: string, role: Role) {
      //----> Fetch the donor-detail and user-id.
      const {userId: userIdOnDonorDetail, donorDetail} = await this.existDonorDetailId(id)
      //----> Check for ownership or admin.
      checkForOwnershipAndAdmin(userId, userIdOnDonorDetail, role);

      //----> send back the response.
      return donorDetail;
  }

  ////----> Fetch one donor-detail by id function.
  async getDonorDetailByUserId(userId: string) {
    //----> Fetch the donor-detail that matches the giving user-id.
    return prisma.donorDetail.findMany({where: {userId: userId}});
  }

  ////----> Fetch and check existence of donor-detail by id function.
  private existDonorDetailId = async (id: string) => {
    //----> Check for existence of the donor-detail with giving id.
    const donorDetail = await prisma.donorDetail.findUnique({ where: { id } });
    if (!donorDetail) {
      throw catchError(
        StatusCodes.NOT_FOUND,
        `The donorDetail with id ${id} does not exist`
      );
    }

    //----> Get the user-id.
    const userId = donorDetail.userId

    //----> Send back the response
    return {donorDetail, userId};
  };

}

export const donorDetailModel = new DonorDetailModel();
