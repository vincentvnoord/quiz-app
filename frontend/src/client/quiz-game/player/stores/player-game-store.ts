import { QuestionSlice, createQuestionSlice } from "@/client/quiz-game/shared/stores/question-slice";
import { create, StateCreator } from "zustand";
import { PlayerGameManager } from "../logic/player-game-manager";
import { createGameSlice, GameSlice } from "../../shared/stores/game-slice";

type GameState = "choose-name" | "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results";

interface GeneralSlice {
    gameManager: PlayerGameManager | null;
    setGameManager: (manager: PlayerGameManager) => void;
    gameState: GameState;
    setGameState: (state: GameState) => void;
}

const createGeneralSlice: StateCreator<GeneralSlice> = (set) => ({
    gameManager: null,
    setGameManager: (gameManager) => set({ gameManager }),

    gameState: "choose-name",
    setGameState: (gameState) => set({ gameState }),
});

export type PlayerGameStore = GeneralSlice & GameSlice & QuestionSlice;

export const usePlayerGameStore = create<PlayerGameStore>()((...a) => ({
    ...createGeneralSlice(...a),
    ...createQuestionSlice(...a),
    ...createGameSlice(...a),
}));

usePlayerGameStore.setState(() => ({
    gameManager: new PlayerGameManager(usePlayerGameStore)
}))