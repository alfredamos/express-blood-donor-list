import {z} from "zod";
import {Gender} from "../models/gender.model";
import {EditProfileDto} from "../dto/editProfile.dto";
import {Role} from "../models/role.model";

export const changePasswordSchema = z.object({
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    newPassword: z.string(),
})

export const editProfileSchema = z.object({
    address: z.string(),
    email: z.string(),
    image: z.string(),
    password: z.string(),
    name: z.string(),
    phone: z.string(),
    gender: z.enum(Gender),
    dateOfBirth: z.date()
}) ;

export const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
})

export const signupSchema = z.object({
    address: z.string(),
    email: z.string(),
    image: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    name: z.string(),
    phone: z.string(),
    gender: z.enum(Gender),
    dateOfBirth: z.date(),
    role: z.enum(Role),
})