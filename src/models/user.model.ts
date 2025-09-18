import {Role} from "./role.model";
import {Gender} from "./gender.model";

export class UserModel{
    name:        string;
	address:     string;
	email:       string;
	image:       string;
	phone:       string;
	password:    string;
	gender:      Gender;
	dateOfBirth: Date; 
	age:         number;
	role: Role;
}