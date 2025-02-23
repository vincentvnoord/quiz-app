import { IUserRepository } from "../../repositories/user-repository/user-repository-interface";
import { IAuthService } from "./auth-service-interface";

export default class AuthService implements IAuthService {

    async login(email: string, password: string): Promise<string> {
        return "token";
    }
}