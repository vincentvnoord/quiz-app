import { IGameService, IGameServiceToken } from "@/business/services/game-service/game-service-interface";
import container from "@/lib/dependencies";

export const createGameController = async (authToken: string, quizId: string) => {
    const service = container.get<IGameService>(IGameServiceToken);
    const code = await service.createGame(authToken, quizId);

    return code;
};