import { create, StateCreator } from "zustand";
import { IGameManager, GameManager } from "../logic/game-manager";
import { GameManagerMock } from "../logic/game-manager-mock";
import { createGameSlice, GameSlice } from "../../shared/stores/game-slice";
import { createPlayerSlice, PlayerSlice } from "./players-slice";
import { QuestionSlice, createQuestionSlice } from "@/client/quiz-game/shared/stores/question-slice";
import { BaseGameState, GameStateDto, PlayerDto } from "../../shared/stores/game-state";

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

export interface HostGameStateDto extends GameStateDto {
    gameState: BaseGameState;
    title: string;
    questionCount: number;
    players: PlayerDto[];
}

export type HostGameStore = {
    gameManager: IGameManager | null;

    state: HostGameStateDto;
    setState: (state: Partial<HostGameStateDto>) => void;
}

const useHostStore = create<HostGameStore>()((set) => ({
    gameManager: null,
    state: {
        gameState: "connecting",
        timer: 0,
        currentQuestion: null,
        correctAnswer: null,
        title: "",
        questionCount: 0,
        players: [],
    },
    setState: (state) => set((currentState) => ({
        state: {
            ...currentState.state,
            ...state
        }
    }))
}));

useHostStore.setState(() => ({
    gameManager: UI_DEBUG ? new GameManagerMock(useHostStore) : new GameManager(useHostStore)
}))

export default useHostStore;