import {Role} from "../models/role.model";
import {Gender} from "../models/gender.model";

export class SignupDto {
  name: string;
  address: string;
  email: string;
  image: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  dateOfBirth: Date;
  role: Role;
}