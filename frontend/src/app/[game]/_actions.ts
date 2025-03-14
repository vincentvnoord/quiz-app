"use server";

import { NotFoundError } from "@/business/entities/errors/common";
import { joinGameController } from "@/controllers/game/join-game-controller"

export const joinGame = async (gameCode: string, playerName: string) => {
    try {
        const playerId = await joinGameController(gameCode, playerName);
        return { success: true, playerId };
    } catch (error) {
        if (error instanceof NotFoundError) {
            return { success: false, message: "Game not found" };
        }

        return { success: false, message: "Failed to join game" };
    }
}