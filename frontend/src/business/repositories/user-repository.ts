import { UserDto } from "../entities/user"

export default interface UserRepository {
    createUser(user: UserDto): Promise<void>;
}