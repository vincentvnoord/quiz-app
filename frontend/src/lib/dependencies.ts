import { UserRepository } from "@/business/repositories/user-repository/user-repository";
import { IUserRepository, IUserRepositoryToken } from "@/business/repositories/user-repository/user-repository-interface";
import { DependencyContainer } from "./container";

const container = new DependencyContainer();

container.register<IUserRepository>(IUserRepositoryToken, new UserRepository());

if (process.env.NODE_ENV === "development") {
}