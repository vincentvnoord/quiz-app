import { IGameService } from "./game-service-interface";

export class GameServiceMock implements IGameService {
    joinGame(gameId: string, playerName: string): Promise<string> {
        throw new Error("Method not implemented." + gameId + playerName);
    }
    createGame(authToken: string): Promise<{ activeGameSession: boolean, code: string }> {
        return Promise.resolve({ activeGameSession: false, code: "123321" + authToken });
    }
}