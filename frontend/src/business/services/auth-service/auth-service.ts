import { UserLoginDto } from "@/business/entities/user";
import { IAuthService } from "./auth-service-interface";
import { UnAuthorizedError } from "@/business/entities/errors/common";

export default class AuthService implements IAuthService {

    async login(userData: UserLoginDto): Promise<string> {
        const res = await fetch(`${process.env.API_URL}/login`, {
            method: "post",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401) {
            throw new UnAuthorizedError("Invalid credentials");
        }

        if (res.status !== 200)
            throw new Error("Unknown server error while creating user, check API logs");

        const responsedata = await res.json();

        return responsedata.token;
    }
}