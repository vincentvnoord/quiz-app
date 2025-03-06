import { create } from "zustand";

type GameState = "lobby" | "playing" | "results";

interface GameStore {
    gameState: GameState;
    setGameState: (state: GameState) => void;
    players: string[];
    setPlayers: (players: string[]) => void;
    addPlayer: (player: string) => void;
}

const useGameStore = create<GameStore>((set) => ({
    setGameState: (gameState) => set({ gameState }),
    gameState: "lobby",
    players: [],
    setPlayers: (players) => set({ players }),
    addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
}));

export default useGameStore;