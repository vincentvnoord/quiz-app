import { create, StateCreator } from "zustand";
import { IGameManager, GameManager } from "../logic/game-manager";
import { GameManagerMock } from "../logic/game-manager-mock";
import { createGameSlice, GameSlice } from "../../shared/stores/game-slice";
import { createPlayerSlice, PlayerSlice } from "./players-slice";
import { QuestionSlice, createQuestionSlice } from "@/client/quiz-game/shared/stores/question-slice";

const UI_DEBUG = false;

type GameState = "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results" | "not-found";

interface GeneralSlice {
    gameManager: IGameManager | null;

    gameState: GameState;
    setGameState: (state: GameState) => void;
}

const createGeneralSlice: StateCreator<GeneralSlice> = (set): GeneralSlice => ({
    gameManager: null,

    setGameState: (gameState) => set({ gameState }),
    gameState: "connecting",
});

export type HostStore = GeneralSlice & GameSlice & PlayerSlice & QuestionSlice;

const useHostStore = create<HostStore>()((...a) => ({
    ...createGeneralSlice(...a),
    ...createGameSlice(...a),
    ...createPlayerSlice(...a),
    ...createQuestionSlice(...a),
}));

useHostStore.setState(() => ({
    gameManager: UI_DEBUG ? new GameManagerMock(useHostStore) : new GameManager(useHostStore)
}))

export default useHostStore;