import express from "express";
import {cookieAdminAuthorizationMiddleware} from "../middlewares/cookieAdminAuthorization.middleware";
import {bloodStatController} from "../controllers/bloodStatController";
import {cookieAuthenticationMiddleware} from "../middlewares/cookieAuthentication.middleware";
import {sameUserAndAdminMiddleware} from "../middlewares/sameUserAndAdmin.middleware";
import {idCheckValidationMiddleware} from "../middlewares/idCheckvalidation.middleware";

const router = express.Router();

router.param("id", idCheckValidationMiddleware);

router.route("/")
    .get(cookieAdminAuthorizationMiddleware, cookieAdminAuthorizationMiddleware, bloodStatController.getAllBloodStats)
    .post(cookieAuthenticationMiddleware, bloodStatController.createBlood)

router.route("/delete-all")
    .delete(cookieAuthenticationMiddleware, cookieAdminAuthorizationMiddleware, bloodStatController.deleteAllBloodStats)

router.route("/get-all-user-id/:userId")
    .get(cookieAuthenticationMiddleware, sameUserAndAdminMiddleware, bloodStatController.getBloodStatByUserId);

router.route("/delete-by-user-id/:userId")
    .delete(cookieAuthenticationMiddleware, sameUserAndAdminMiddleware, bloodStatController.deleteBloodByUserId)


router.route("/:id")
.get(cookieAuthenticationMiddleware, bloodStatController.getBloodStatById)
.patch(cookieAuthenticationMiddleware, bloodStatController.editBloodStatById)
.delete(cookieAuthenticationMiddleware, bloodStatController.deleteBloodById);