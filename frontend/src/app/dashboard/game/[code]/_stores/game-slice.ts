import { IGameManager } from "../_logic/game-manager";

type GameState = "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results" | "not-found";

export interface GameSlice {
    gameManager: IGameManager | null;

    gameCode: string;
    setGameCode: (gameCode: string) => void;

    gameState: GameState;
    setGameState: (state: GameState) => void;

    title: string;
    setTitle: (title: string) => void;

    questionCount: number;
    setQuestionCount: (questionCount: number) => void;

    timer: number;
    setTimer: (timer: number) => void;
}

export const createGameSlice = (set: any): GameSlice => ({
    gameManager: null,

    gameCode: "",
    setGameCode: (gameCode) => set({ gameCode }),

    setGameState: (gameState) => set({ gameState }),
    gameState: "connecting",

    title: "",
    setTitle: (title) => set({ title }),

    questionCount: 0,
    setQuestionCount: (questionCount) => set({ questionCount }),

    timer: 5,
    setTimer: (timer) => { set({ timer }) },
});