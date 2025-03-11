import { HubConnection } from "@microsoft/signalr";
import { create } from "zustand";

type GameState = "choose-name" | "connecting" | "lobby" | "playing" | "results";

interface GameStore {
    gameCode: string;
    setGameCode: (gameCode: string) => void;

    gameState: GameState;
    setGameState: (state: GameState) => void;
}

export const usePlayerGameStore = create<GameStore>((set) => ({
    gameCode: "",
    setGameCode: (gameCode) => set({ gameCode }),

    gameState: "connecting",
    setGameState: (gameState) => set({ gameState }),
}));