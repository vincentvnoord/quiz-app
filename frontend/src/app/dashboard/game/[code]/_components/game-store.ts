import { HubConnection } from "@microsoft/signalr";
import { create } from "zustand";

export type Player = {
    id: string;
    name: string;
}

type GameState = "lobby" | "playing" | "results";

interface GameStore {
    connection: HubConnection | null;
    setConnection: (connection: HubConnection | null) => void;

    gameCode: string;
    setGameCode: (gameCode: string) => void;

    gameState: GameState;
    setGameState: (state: GameState) => void;

    title: string;
    setTitle: (title: string) => void;

    questionCount: number;
    setQuestionCount: (questionCount: number) => void;

    players: Player[];
    setPlayers: (players: Player[]) => void;
    addPlayer: (player: Player) => void;
    removePlayer: (playerId: string) => void;
}

const useGameStore = create<GameStore>((set) => ({
    connection: null,
    setConnection: (connection) => set({ connection }),

    gameCode: "",
    setGameCode: (gameCode) => set({ gameCode }),

    setGameState: (gameState) => set({ gameState }),
    gameState: "lobby",

    title: "",
    setTitle: (title) => set({ title }),

    questionCount: 0,
    setQuestionCount: (questionCount) => set({ questionCount }),

    players: [],
    setPlayers: (players) => set({ players }),
    addPlayer: (player) => set((state) => {
        const updatedPlayers = state.players.some(p => p.id === player.id)
            ? state.players.map(p => p.id === player.id ? player : p)
            : [...state.players, player];

        return { players: updatedPlayers };
    }),
    removePlayer: (playerId) => set((state) => ({ players: state.players.filter((player) => player.id !== playerId) })),
}));

export default useGameStore;