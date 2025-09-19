import {z} from "zod";
import {Gender} from "../models/gender.model";
import {Role} from "../models/role.model";

export const changePasswordSchema = z.object({
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    newPassword: z.string(),
}).refine((values) => {
    return values.newPassword === values.confirmPassword;
})

export const editProfileSchema = z.object({
    address: z.string(),
    email: z.string(),
    image: z.string(),
    password: z.string(),
    name: z.string(),
    phone: z.string(),
    gender: z.enum(Gender),
    dateOfBirth: z.string()
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
    dateOfBirth: z.string(),
    role: z.enum(Role),
}).refine((values) => {
    return values.password === values.confirmPassword;
})
