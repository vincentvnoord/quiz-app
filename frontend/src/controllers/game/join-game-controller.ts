import { IGameService, IGameServiceToken } from "@/business/services/game-service/game-service-interface"
import container from "@/lib/dependencies"

export const joinGameController = (gameId: string, playerName: string): Promise<string> => {
    const service = container.get<IGameService>(IGameServiceToken);
    return service.joinGame(gameId, playerName);
}