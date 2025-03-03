import { InputParseError } from "@/business/entities/errors/common";
import { UserLoginDto } from "@/business/entities/user";
import { IAuthService, IAuthServiceToken } from "@/business/services/auth-service/auth-service-interface";
import container from "@/lib/dependencies";
import { FieldValues } from "react-hook-form";
import z from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string(),
});

export const loginController = async (fieldValues: FieldValues) => {
    const authService = container.get<IAuthService>(IAuthServiceToken);
    const { data, success, error } = loginSchema.safeParse(fieldValues);
    if (!success) {
        throw new InputParseError("Error parsing input", error);
    }

    const userLoginDto: UserLoginDto = {
        email: data.email,
        password: data.password,
    }
    
    return await authService.login(userLoginDto);
};