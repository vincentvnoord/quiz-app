
export const IGameServiceToken = Symbol.for("IGameService");

export interface IGameService {
    createGame(authToken: string, quizId: string): Promise<string>;
    joinGame(gameId: string, playerName: string): Promise<string>;
}