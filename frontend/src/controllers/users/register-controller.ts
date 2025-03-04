import { InputParseError } from "@/business/entities/errors/common";
import { UserDto } from "@/business/entities/user";
import { IUserRepository, IUserRepositoryToken } from "@/business/repositories/user-repository/user-repository-interface";
import container from "@/lib/dependencies";
import { FieldValues } from "react-hook-form";
import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(12, "Password must be at least 12 characters"),
    privacy: z.boolean().refine(value => value === true, { message: "Please agree to our privacy policy" }),
});

export const registerUserController = async (fieldValues: FieldValues) => {
    const repository = container.get<IUserRepository>(IUserRepositoryToken);

    const { data, success, error } = registerSchema.safeParse(fieldValues);
    if (!success) {
        throw new InputParseError("Error parsing input", error);
    }

    const userDto: UserDto = {
        email: data.email,
        password: data.password,
    }

    await repository.createUser(userDto);
};