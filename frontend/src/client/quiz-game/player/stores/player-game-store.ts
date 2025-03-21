import { QuestionSlice, createQuestionSlice } from "@/client/quiz-game/shared/stores/question-slice";
import { create, StateCreator } from "zustand";
import { IGameManager, PlayerGameManager } from "../logic/player-game-manager";
import { createGameSlice, GameSlice } from "../../shared/stores/game-slice";
import { PlayerGameManagerMock } from "../logic/player-game-manager-mock";

type GameState = "choose-name" | "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results";

const UI_DEBUG = false;

interface GeneralSlice {
    gameManager: IGameManager | null;
    setGameManager: (manager: IGameManager) => void;
    gameState: GameState;
    setGameState: (state: GameState) => void;
}

const createGeneralSlice: StateCreator<GeneralSlice> = (set) => ({
    gameManager: null,
    setGameManager: (gameManager) => set({ gameManager }),

    gameState: "connecting",
    setGameState: (gameState) => set({ gameState }),
});

export type PlayerGameStore = GeneralSlice & GameSlice & QuestionSlice;

export const usePlayerGameStore = create<PlayerGameStore>()((...a) => ({
    ...createGeneralSlice(...a),
    ...createQuestionSlice(...a),
    ...createGameSlice(...a),
}));

usePlayerGameStore.setState(() => ({
    gameManager: UI_DEBUG ? new PlayerGameManagerMock(usePlayerGameStore) : new PlayerGameManager(usePlayerGameStore)
}))