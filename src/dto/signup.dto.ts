import {Role} from "../models/role.model";
import {Gender} from "../models/gender.model";

export class SignupDto {
  id: string;
  name: string;
  address: string;
  email: string;
  image: string;
  phone: string;
  gender: Gender;
  password:    string;
  confirmPassword:  string;
  dateOfBirth: Date;
  role: Role;
}