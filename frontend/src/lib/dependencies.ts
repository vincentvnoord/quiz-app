import { UserRepository } from "@/business/repositories/user-repository/user-repository";
import { IUserRepository, IUserRepositoryToken } from "@/business/repositories/user-repository/user-repository-interface";
import { DependencyContainer } from "./container";
import { IAuthService, IAuthServiceToken } from "@/business/services/auth-service/auth-service-interface";
import AuthService from "@/business/services/auth-service/auth-service";

const container = new DependencyContainer();

container.register<IUserRepository>(IUserRepositoryToken, new UserRepository());
container.register<IAuthService>(IAuthServiceToken, new AuthService());

if (process.env.NODE_ENV === "development") {
}

export default container;