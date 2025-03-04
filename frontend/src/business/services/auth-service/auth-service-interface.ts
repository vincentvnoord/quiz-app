import { UserLoginDto } from "@/business/entities/user";

export const IAuthServiceToken = Symbol.for("IAuthService");

export interface IAuthService {
    login(userData: UserLoginDto): Promise<string>;
}