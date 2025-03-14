import { IGameService, IGameServiceToken } from "@/business/services/game-service/game-service-interface";
import container from "@/lib/dependencies";

export const createGameController = async (authToken: string, quizId: string, terminateExisting: boolean) => {
    const service = container.get<IGameService>(IGameServiceToken);
    const res = await service.createGame(authToken, quizId, terminateExisting);

    return res;
};