import { UserLoginDto } from "@/business/entities/user";
import { IUserRepository } from "../../repositories/user-repository/user-repository-interface";
import { IAuthService } from "./auth-service-interface";

export default class AuthService implements IAuthService {
    
    async login(userData: UserLoginDto): Promise<string> {
        return "token";
    }
}