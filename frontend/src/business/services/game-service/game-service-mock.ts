import { IGameService } from "./game-service-interface";

export class GameServiceMock implements IGameService {
    createGame(authToken: string): Promise<string> {
        return new Promise((resolve) => {
            resolve("123321");
        });
    }
}