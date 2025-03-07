import { UnAuthorizedError } from "@/business/entities/errors/common";
import { IGameService } from "./game-service-interface";

export class GameService implements IGameService {
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
        console.log(data);
        return data.code;
    }
}