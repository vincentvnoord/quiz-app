import { HubConnection } from "@microsoft/signalr";
import { create } from "zustand";
import { GameManager, IGameManager } from "../_logic/game-manager";
import { GameManagerMock } from "../_logic/game-manager-mock";

export type Player = {
    id: string;
    name: string;
}

const UI_DEBUG = false;

type GameState = "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results" | "not-found";

export interface GameStore {
    gameManager: IGameManager | null;

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
    gameManager: null,

    connection: null,
    setConnection: (connection) => set({ connection }),

    gameCode: "",
    setGameCode: (gameCode) => set({ gameCode }),

    setGameState: (gameState) => set({ gameState }),
    gameState: "connecting",

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

useGameStore.setState((state) => ({
    gameManager: UI_DEBUG ? new GameManagerMock(state) : new GameManager(state)
}))

export default useGameStore;