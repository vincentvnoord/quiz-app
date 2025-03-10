import { IGameService } from "./game-service-interface";

export class GameServiceMock implements IGameService {
    joinGame(gameId: string, playerName: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    createGame(authToken: string): Promise<string> {
        return new Promise((resolve) => {
            resolve("123321");
        });
    }
}