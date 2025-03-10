import { HubConnection } from "@microsoft/signalr";
import { create } from "zustand";

type GameState = "lobby" | "playing" | "results";

interface GameStore {
    connection: HubConnection | null;
    setConnection: (connection: HubConnection | null) => void;

    gameCode: string;
    setGameCode: (gameCode: string) => void;

    gameState: GameState;
    setGameState: (state: GameState) => void;

    playerName: string;
    setPlayerName: (playerName: string) => void;

    playerId: string | null;
    setPlayerId: (playerId: string) => void;
}


export const usePlayerGameStore = create<GameStore>((set) => ({
    connection: null,
    setConnection: (connection) => set({ connection }),

    gameCode: "",
    setGameCode: (gameCode) => set({ gameCode }),

    gameState: "lobby",
    setGameState: (gameState) => set({ gameState }),

    playerName: "",
    setPlayerName: (playerName) => set({ playerName }),

    playerId: null,
    setPlayerId: (playerId) => set({ playerId }),
}));