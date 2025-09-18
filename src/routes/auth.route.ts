import express from "express";
import {signUpValidationMiddleware} from "../middlewares/signUpValidationMiddleware";
import {authController} from "../controllers/AuthController";
import {changePasswordValidationMiddleware} from "../middlewares/changePasswordValidation.middleware";
import {editProvideValidationMiddleware} from "../middlewares/editProvideValidation.middleware";
import {loginValidationMiddleware} from "../middlewares/loginValidation.middleware";

const router = express.Router();

//----> change-password route.
router.route("/change-password")
    .patch(changePasswordValidationMiddleware, authController.changePassword);

//----> edit-profile route.
router.route("/edit-profile")
    .patch(editProvideValidationMiddleware, authController.editProfile);

//----> Login route.
router.route("/login")
    .post(loginValidationMiddleware, authController.login);

//----> Sign-up route.
router.route("/signup")
    .post(signUpValidationMiddleware, authController.signUp);


export default router;