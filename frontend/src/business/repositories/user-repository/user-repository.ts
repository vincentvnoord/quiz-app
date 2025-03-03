import { UserDto } from "@/business/entities/user";
import { IUserRepository } from "./user-repository-interface";
import { RegistrationError, RegistrationErrorType } from "@/business/entities/errors/RegistrationError";

export class UserRepository implements IUserRepository {
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