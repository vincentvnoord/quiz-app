import { UserDto } from "../../entities/user"

export const IUserRepositoryToken = Symbol.for("IUserRepository");

export interface IUserRepository {
    createUser(user: UserDto): Promise<void>;
}