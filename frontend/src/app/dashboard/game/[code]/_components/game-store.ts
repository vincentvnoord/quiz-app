import { create } from "zustand";

type GameState = "lobby" | "playing" | "results";

interface GameStore {
    gameCode: string;
    setGameCode: (gameCode: string) => void;

    gameState: GameState;
    setGameState: (state: GameState) => void;

    title: string;
    setTitle: (title: string) => void;

    players: string[];
    setPlayers: (players: string[]) => void;
    addPlayer: (player: string) => void;
}

const useGameStore = create<GameStore>((set) => ({
    gameCode: "",
    setGameCode: (gameCode) => set({ gameCode }),

    setGameState: (gameState) => set({ gameState }),
    gameState: "lobby",

    title: "",
    setTitle: (title) => set({ title }),

    players: [],
    setPlayers: (players) => set({ players }),
    addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
}));

export default useGameStore;