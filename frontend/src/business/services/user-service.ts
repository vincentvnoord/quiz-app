import UserRepository from "../repositories/user-repository";


export default class UserService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }
    
    createUser(user: { email: string, password: string }): Promise<void> {
        return this.repository.createUser(user);
    }
}