import { UserDto } from "@/business/entities/user";
import { IUserRepository } from "./user-repository-interface";

export class UserRepository implements IUserRepository {
    async createUser(user: UserDto): Promise<void> {
        try {
            // Call API to create user
        } catch (e) {
            throw new Error("Error creating user");
        }
    }
}