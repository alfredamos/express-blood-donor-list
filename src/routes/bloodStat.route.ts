import express from "express";
import {cookieAdminAuthorizationMiddleware} from "../middlewares/cookieAdminAuthorization.middleware";
import {bloodStatController} from "../controllers/bloodStatController";
import {cookieAuthenticationMiddleware} from "../middlewares/cookieAuthentication.middleware";
import {sameUserAndAdminMiddleware} from "../middlewares/sameUserAndAdmin.middleware";
import {idCheckValidationMiddleware} from "../middlewares/idCheckvalidation.middleware";
import {bloodStatCreateValidationMiddleware} from "../middlewares/bloodStatCreateValidation.middleware";
import {bloodStatUpdateValidationMiddleware} from "../middlewares/bloodStatUpdateValidation";

const router = express.Router();

router.param("id", idCheckValidationMiddleware);

router.route("/")
    .get(cookieAdminAuthorizationMiddleware, cookieAdminAuthorizationMiddleware, bloodStatController.getAllBloodStats)
    .post(bloodStatCreateValidationMiddleware, cookieAuthenticationMiddleware,bloodStatController.createBloodStat)

router.route("/all/delete-all")
    .delete(cookieAuthenticationMiddleware, cookieAdminAuthorizationMiddleware, bloodStatController.deleteAllBloodStats)

router.route("/get-by-user-id/:userId")
    .get(cookieAuthenticationMiddleware, sameUserAndAdminMiddleware, bloodStatController.getBloodStatByUserId);

router.route("/delete-by-user-id/:userId")
    .delete(cookieAuthenticationMiddleware, sameUserAndAdminMiddleware, bloodStatController.deleteBloodByUserId)


router.route("/:id")
.get(cookieAuthenticationMiddleware, bloodStatController.getBloodStatById)
.patch(bloodStatUpdateValidationMiddleware, cookieAuthenticationMiddleware, bloodStatController.editBloodStatById)
.delete(cookieAuthenticationMiddleware, bloodStatController.deleteBloodById);

export default router;