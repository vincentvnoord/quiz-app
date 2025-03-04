import { User } from "@/business/entities/user";
import { IUserRepository, IUserRepositoryToken } from "@/business/repositories/user-repository/user-repository-interface";
import container from "@/lib/dependencies";

export const getUserController = (id: string): Promise<User> => {
    const userRepository = container.get<IUserRepository>(IUserRepositoryToken);
    return userRepository.getUser(id);
}