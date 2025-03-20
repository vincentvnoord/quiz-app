import { QuestionSlice, createQuestionSlice } from "@/client/quiz-game/shared/stores/question-slice";
import { create } from "zustand";
import { PlayerGameManager } from "../logic/player-game-manager";
import { createGameSlice, GameSlice } from "../../shared/stores/game-slice";

type GameState = "choose-name" | "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results";

interface GameStore {
    gameManager: PlayerGameManager | null;
    setGameManager: (manager: PlayerGameManager) => void;
    gameState: GameState;
    setGameState: (state: GameState) => void;
}

export const usePlayerGameStore = create<GameStore & GameSlice & QuestionSlice>((set) => ({
    gameManager: null,
    setGameManager: (gameManager) => set({ gameManager }),

    gameState: "connecting",
    setGameState: (gameState) => set({ gameState }),

    ...createQuestionSlice(set),
    ...createGameSlice(set),
}));

usePlayerGameStore.setState((state) => ({
    gameManager: new PlayerGameManager(usePlayerGameStore)
}))