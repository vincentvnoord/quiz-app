import { create } from "zustand";
import { IGameManager, PlayerGameManager } from "../logic/player-game-manager";
import { PlayerGameManagerMock } from "../logic/player-game-manager-mock";
import { BaseGameState, GameStateDto, PlayerDto } from "../../shared/stores/game-state";

const UI_DEBUG = false;

export interface PlayerGameStateDto extends GameStateDto {
    gameCode: string;
    gameState: BaseGameState | "choose-name";
    player: PlayerDto;
}

export interface PlayerGameStore {
    gameManager: IGameManager | null;
    setGameManager: (manager: IGameManager) => void;
    state: PlayerGameStateDto;
    setState: (state: Partial<PlayerGameStateDto>) => void;
}

export const usePlayerGameStore = create<PlayerGameStore>()((set) => ({
    gameManager: null,
    setGameManager: (manager) => set({ gameManager: manager }),
    state: {
        gameCode: "",
        gameState: "connecting",
        timer: 0,
        currentQuestion: null,
        correctAnswer: null,

        player: {
            id: "",
            name: "",
        },
    },
    setState: (state) => set((currentState) => ({
        state: {
            ...currentState.state,
            ...state
        }
    }))
}));

usePlayerGameStore.setState((state) => ({
    ...state.state,
    gameManager: UI_DEBUG ? new PlayerGameManagerMock(usePlayerGameStore) : new PlayerGameManager(usePlayerGameStore)
}))