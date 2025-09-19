import {Gender, Role} from "@prisma/client";

export class UserDto{
    name:        string;
    address:     string;
    email:       string;
    image:       string;
    phone:       string;
    gender:      Gender;
    age:         number;
    role: Role;
}