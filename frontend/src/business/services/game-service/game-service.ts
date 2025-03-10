import { NotFoundError, UnAuthorizedError } from "@/business/entities/errors/common";
import { IGameService } from "./game-service-interface";

export class GameService implements IGameService {
    async joinGame(gameId: string, playerName: string): Promise<string> {
        console.log("Joining game: ", { gameId, playerName });
        const res = await fetch(`${process.env.URL}/api/game/join`, {
            method: "post",
            body: JSON.stringify({
                code: gameId,
                playerName
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (res.status === 404)
            throw new NotFoundError("Game not found");

        if (res.status !== 200)
            throw new Error("Failed to join game");

        const data = await res.json();
        console.log(data);

        return data.playerId;
    }

    async createGame(authToken: string, quizId: string): Promise<string> {
        const res = await fetch(`${process.env.URL}/api/game/create`, {
            method: "post",
            body: JSON.stringify({
                quizId
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        });

        console.log(res);

        if (res.status === 401) {
            throw new UnAuthorizedError("Unauthorized");
        }

        if (res.status !== 200) {
            throw new Error("Failed to create game");
        }

        const data = await res.json();
        return data.code;
    }
}