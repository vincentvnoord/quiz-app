import { createQuestionSlice, QuestionSlice } from "@/app/dashboard/game/[code]/_stores/question-slice";
import { create } from "zustand";
import { GameManager } from "../_logic/game-manager";

type GameState = "choose-name" | "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results";

interface GameStore {
    gameManager: GameManager | null;
    setGameManager: (manager: GameManager) => void;

    gameCode: string;
    setGameCode: (gameCode: string) => void;

    gameState: GameState;
    setGameState: (state: GameState) => void;

    timer: number;
    setTimer: (timer: number) => void;
}

export const usePlayerGameStore = create<GameStore & QuestionSlice>((set) => ({
    gameManager: null,
    setGameManager: (gameManager) => set({ gameManager }),

    gameCode: "",
    setGameCode: (gameCode) => set({ gameCode }),

    gameState: "connecting",
    setGameState: (gameState) => set({ gameState }),

    timer: 0,
    setTimer: (timer) => set({ timer }),

    ...createQuestionSlice(set),
}));

usePlayerGameStore.setState((state) => ({
    gameManager: new GameManager(usePlayerGameStore)
}))