import {Request, Response} from "express";
import {userModel} from "../models/user.model";
import {StatusCodes} from "http-status-codes";
import {checkResourceContent} from "../utils/checkResourceContent";
import {ResponseMessage} from "../utils/reponseMessage";

class UserController {
    ////----> Delete one user by id controller.
    async deleteUserById(req: Request, res: Response): Promise<void> {
        //----> Get the id from params object on request object.
        const { id } = req.params;

        //----> Get the user-id from user object on request object,
        const {id: userId, role} = req.user;

        //----> Delete the user with the giving id.
        await userModel.deleteUserById(id, userId, role);

        //----> Send back the response.
        res.status(StatusCodes.OK).json( new ResponseMessage(
            "User has been deleted successfully!",
            "success",
            200
        ));
    }

    ////----> Get one user by id controller.
    async getUserById(req: Request, res: Response): Promise<void> {
        //----> Get the id from params object on request object.
        const { id } = req.params;

        //----> Get the user-id from user object on request object,
        const {id: userId, role} = req.user;

        //----> Fetch the user with the giving id.
        const user = await userModel.getUserById(id, userId, role);

        //----> Send back the response.
        res.status(StatusCodes.OK).send(user);
    }

    ////----> Get all users controller.
    async getAllUsers(req: Request, res: Response): Promise<void> {
        //----> Fetch all users.
        const allUsers = await userModel.getAllUsers();

        //----> Check for empty content.
        checkResourceContent(allUsers.length);

        //----> Send back the response.
        res.status(StatusCodes.OK).send(allUsers);
    }

}

export const userController = new UserController();