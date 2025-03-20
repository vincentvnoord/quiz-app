import { create } from "zustand";
import { IGameManager, GameManager } from "../logic/game-manager";
import { GameManagerMock } from "../logic/game-manager-mock";
import { createGameSlice, GameSlice } from "../../shared/stores/game-slice";
import { createPlayerSlice, PlayerSlice } from "./players-slice";
import { QuestionSlice, createQuestionSlice } from "@/client/quiz-game/shared/stores/question-slice";

const UI_DEBUG = false;

type GameState = "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results" | "not-found";

export type HostStore = {
    gameManager: IGameManager | null;

    gameState: GameState;
    setGameState: (state: GameState) => void;

    initializeGame: (initialState: Partial<HostStore>) => void;
} & GameSlice & PlayerSlice & QuestionSlice;

const useHostStore = create<HostStore>((set) => ({
    gameManager: null,

    setGameState: (gameState) => set({ gameState }),
    gameState: "connecting",

    ...createGameSlice(set),
    ...createPlayerSlice(set),
    ...createQuestionSlice(set),

    initializeGame: (initialState: Partial<HostStore>) => set((state) => {
        console.log("Initializing game with", initialState);
        const updates: Partial<HostStore> = {
            title: initialState.title ?? state.title,
            questionCount: initialState.questionCount ?? state.questionCount,
            gameState: initialState.gameState ?? state.gameState,
            players: initialState.players ?? state.players,
        };

        if (initialState.gameState === "question" || initialState.gameState === "reveal-answer") {
            updates.currentQuestion = initialState.currentQuestion ?? state.currentQuestion;
            updates.correctAnswer = initialState.correctAnswer ?? state.correctAnswer;
        }

        return updates;
    }),
}));

useHostStore.setState((state) => ({
    gameManager: UI_DEBUG ? new GameManagerMock(useHostStore) : new GameManager(useHostStore)
}))

export default useHostStore;