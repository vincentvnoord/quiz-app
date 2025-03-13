import { IGameService } from "./game-service-interface";

export class GameServiceMock implements IGameService {
    joinGame(gameId: string, playerName: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    createGame(authToken: string): Promise<{ activeGameSession: boolean, code: string }> {
        return new Promise((resolve) => {
            resolve({ activeGameSession: false, code: "123321" });
        });
    }
}