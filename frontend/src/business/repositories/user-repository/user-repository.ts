import { User, UserDto } from "@/business/entities/user";
import { IUserRepository } from "./user-repository-interface";
import { RegistrationError, RegistrationErrorType } from "@/business/entities/errors/RegistrationError";
import { UnAuthorizedError } from "@/business/entities/errors/common";

export class UserRepository implements IUserRepository {
    async getUser(authToken: string): Promise<User> {
        const res = await fetch(`${process.env.URL}/api/user`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            credentials: "include"
        });
        
        if (res.status === 401)
            throw new UnAuthorizedError("Unauthorized");

        if (!res.ok)
            throw new Error("Unknown server error while fetching user, check API logs");

        const data = await res.json();

        return {
            id: data.id,
            email: data.email
        }
    }

    async createUser(user: UserDto): Promise<void> {
        try {
            const res = await fetch(`${process.env.URL}/api/register`, {
                method: "post",
                body: JSON.stringify(user),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.status === 409) {
                throw new RegistrationError("User already exists", RegistrationErrorType.EMAIL_EXISTS);
            } else if (!res.ok) {
                throw new Error("Unknown server error while creating user, check API logs");
            }
        } catch (e) {
            console.error("Error creating user: ", e);
            throw e;
        }
    }
}