import express from "express";
import {idCheckValidationMiddleware} from "../middlewares/idCheckvalidation.middleware";
import {cookieAdminAuthorizationMiddleware} from "../middlewares/cookieAdminAuthorization.middleware";
import {vitalController} from "../controllers/vital.controller";
import {cookieAuthenticationMiddleware} from "../middlewares/cookieAuthentication.middleware";
import {vitalUpdateValidationMiddleware} from "../middlewares/vitalUpdateValidation.middleware";
import {userController} from "../controllers/user.controller";
import {sameUserAndAdminMiddleware} from "../middlewares/sameUserAndAdmin.middleware";

const router = express.Router();

router.param("id", idCheckValidationMiddleware);

router.route("/")
    .get(cookieAdminAuthorizationMiddleware, cookieAdminAuthorizationMiddleware, userController.getAllUsers)


router.route("/:id")
    .get(cookieAuthenticationMiddleware, userController.getUserById)
    .delete(cookieAuthenticationMiddleware, userController.deleteUserById);

export default router;