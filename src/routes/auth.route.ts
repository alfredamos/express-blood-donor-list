import express from "express";
import {signUpValidationMiddleware} from "../middlewares/signUpValidation.middleware";
import {authController} from "../controllers/authController";
import {changePasswordValidationMiddleware} from "../middlewares/changePasswordValidation.middleware";
import {editProvideValidationMiddleware} from "../middlewares/editProvideValidation.middleware";
import {loginValidationMiddleware} from "../middlewares/loginValidation.middleware";
import {cookieAuthenticationMiddleware} from "../middlewares/cookieAuthentication.middleware";

const router = express.Router();

//----> change-password route.
router.route("/change-password")
    .patch(changePasswordValidationMiddleware, cookieAuthenticationMiddleware, authController.changePassword);

//----> edit-profile route.
router.route("/edit-profile")
    .patch(editProvideValidationMiddleware, cookieAuthenticationMiddleware, authController.editUserProfile);

//----> Get current user.
router.route("/me")
    .get(cookieAuthenticationMiddleware, authController.getCurrentUser)


//----> Login route.
router.route("/login")
    .post(loginValidationMiddleware, authController.loginUser);

//----> Sign-up route.
router.route("/signup")
    .post(signUpValidationMiddleware, authController.signUpUser);

router.route("/refresh")
    .post(authController.refreshUserToken);

router.route("/logout")
    .post(authController.logoutUser);



export default router;