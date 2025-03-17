import { create } from "zustand";
import { GameManager, IGameManager } from "../_logic/game-manager";
import { GameManagerMock } from "../_logic/game-manager-mock";

export type Player = {
    id: string;
    name: string;
}

const UI_DEBUG = true;

type GameState = "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results" | "not-found";
export type Question = {
    text: string;
    answers: string[];
    timeToAnswer: number;
}

export interface GameStore {
    gameManager: IGameManager | null;

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

    timer: number;
    setTimer: (timer: number) => void;

    currentQuestion: Question;
    setCurrentQuestion: (question: Question) => void;
}

const useGameStore = create<GameStore>((set) => ({
    gameManager: null,

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

    timer: 5,
    setTimer: (timer) => { set({ timer }) },

    currentQuestion: { text: "", answers: [], timeToAnswer: 0 },
    setCurrentQuestion: (question) => set({ currentQuestion: question }),
}));

useGameStore.setState((state) => ({
    gameManager: UI_DEBUG ? new GameManagerMock(state) : new GameManager(state)
}))

export default useGameStore;