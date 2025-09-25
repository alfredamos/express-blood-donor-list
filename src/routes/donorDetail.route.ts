import { cookieAdminAuthorizationMiddleware } from "../middlewares/cookieAdminAuthorization.middleware";
import { cookieAuthenticationMiddleware } from "../middlewares/cookieAuthentication.middleware";
import { idCheckValidationMiddleware } from "../middlewares/idCheckvalidation.middleware";
import express from "express";
import {sameUserAndAdminMiddleware} from "../middlewares/sameUserAndAdmin.middleware";
import {donorDetailController} from "../controllers/donorDetail.controller";
import {donorDetailCreateValidationMiddleware} from "../middlewares/donorDetailCreateValidation.middleware";
import {donorDetailUpdateValidationMiddleware} from "../middlewares/donorDetailUpdateValidation.middleware";

const router = express.Router();

router.param("id", idCheckValidationMiddleware);

router.route("/")
    .get(cookieAdminAuthorizationMiddleware, cookieAdminAuthorizationMiddleware, donorDetailController.getAllDonorDetails)
    .post(donorDetailCreateValidationMiddleware, cookieAuthenticationMiddleware,donorDetailController.createDonorDetail)

router.route("/all/delete-all")
    .delete(cookieAuthenticationMiddleware, cookieAdminAuthorizationMiddleware, donorDetailController.deleteAllDonorDetails)

router.route("/get-by-user-id/:userId")
    .get(cookieAuthenticationMiddleware, sameUserAndAdminMiddleware, donorDetailController.getDonorDetailByUserId);

router.route("/delete-by-user-id/:userId")
    .delete(cookieAuthenticationMiddleware, sameUserAndAdminMiddleware, donorDetailController.deleteDonorDetailByUserId)


router.route("/:id")
.get(cookieAuthenticationMiddleware, donorDetailController.getDonorDetailById)
.patch(donorDetailUpdateValidationMiddleware, cookieAuthenticationMiddleware, donorDetailController.editDonorDetailById)
.delete(cookieAuthenticationMiddleware, donorDetailController.deleteDonorDetailById);

export default router;