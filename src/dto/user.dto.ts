import {Gender, Role} from "@prisma/client";

export class UserDto{
    name:        string;
    address:     string;
    email:       string;
    image:       string;
    phone:       string;
    password:    string;
    age:       number;
    gender:      Gender;
    role: Role;
}