
export const IGameServiceToken = Symbol.for("IGameService");

export interface IGameService {
    createGame(authToken: string, quizId: string, terminateExisting: boolean): Promise<{ activeGameSession: boolean, code: string }>;
    joinGame(gameId: string, playerName: string): Promise<string>;
}