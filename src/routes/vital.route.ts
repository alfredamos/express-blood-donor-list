import { vitalCreateValidationMiddleware } from "../middlewares/vitalCreateValidation.middleware";
import { cookieAdminAuthorizationMiddleware } from "../middlewares/cookieAdminAuthorization.middleware";
import { cookieAuthenticationMiddleware } from "../middlewares/cookieAuthentication.middleware";
import { idCheckValidationMiddleware } from "../middlewares/idCheckvalidation.middleware";
import express from "express";
import {sameUserAndAdminMiddleware} from "../middlewares/sameUserAndAdmin.middleware";
import {vitalController} from "../controllers/vital.controller";
import {vitalUpdateValidationMiddleware} from "../middlewares/vitalUpdateValidation.middleware";

const router = express.Router();

router.param("id", idCheckValidationMiddleware);

router.route("/")
    .get(cookieAdminAuthorizationMiddleware, cookieAdminAuthorizationMiddleware, vitalController.getAllVitals)
    .post(vitalCreateValidationMiddleware, cookieAuthenticationMiddleware,vitalController.createVital)

router.route("/all/delete-all")
    .delete(cookieAuthenticationMiddleware, cookieAdminAuthorizationMiddleware, vitalController.deleteAllVitals)

router.route("/get-by-user-id/:userId")
    .get(cookieAuthenticationMiddleware, sameUserAndAdminMiddleware, vitalController.getVitalByUserId);

router.route("/delete-by-user-id/:userId")
    .delete(cookieAuthenticationMiddleware, sameUserAndAdminMiddleware, vitalController.deleteBloodByUserId)


router.route("/:id")
.get(cookieAuthenticationMiddleware, vitalController.getVitalById)
.patch(vitalUpdateValidationMiddleware, cookieAuthenticationMiddleware, vitalController.editVitalById)
.delete(cookieAuthenticationMiddleware, vitalController.deleteBloodById);

export default router;