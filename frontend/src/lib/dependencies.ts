import { DependencyContainer } from "./container";

import { UserRepository } from "@/business/repositories/user-repository/user-repository";
import { IUserRepository, IUserRepositoryToken } from "@/business/repositories/user-repository/user-repository-interface";
import { IAuthService, IAuthServiceToken } from "@/business/services/auth-service/auth-service-interface";
import AuthService from "@/business/services/auth-service/auth-service";
import { IGameService, IGameServiceToken } from "@/business/services/game-service/game-service-interface";
import { GameService } from "@/business/services/game-service/game-service";

const container = new DependencyContainer();

container.register<IUserRepository>(IUserRepositoryToken, new UserRepository());
container.register<IAuthService>(IAuthServiceToken, new AuthService());
container.register<IGameService>(IGameServiceToken, new GameService());

if (process.env.NODE_ENV === "development") {
}

export default container;