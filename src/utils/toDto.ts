import {User} from "@prisma/client";
import {UserDto} from "../dto/user.dto";

export function toUserDto(user: User): UserDto {
    return {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        age: user.age,
        image: user.image,
        role: user.role,
    }
}