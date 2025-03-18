import { create } from "zustand";
import { GameManager } from "../_logic/game-manager";
import { GameManagerMock } from "../_logic/game-manager-mock";
import { createGameSlice, GameSlice } from "./game-slice";
import { createPlayerSlice, PlayerSlice } from "./players-slice";
import { createQuestionSlice, QuestionSlice } from "./question-slice";

const UI_DEBUG = false;

export type GameStore = GameSlice & PlayerSlice & QuestionSlice;

const useGameStore = create<GameStore>((set) => ({
    ...createGameSlice(set),
    ...createPlayerSlice(set),
    ...createQuestionSlice(set),
}));

useGameStore.setState((state) => ({
    gameManager: UI_DEBUG ? new GameManagerMock(useGameStore) : new GameManager(useGameStore)
}))

export default useGameStore;