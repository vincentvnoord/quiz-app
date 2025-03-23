import { create } from "zustand";
import { IGameManager, GameManager } from "../logic/game-manager";
import { GameManagerMock } from "../logic/game-manager-mock";
import { BaseGameState, GameStateDto, PlayerDto } from "../../shared/stores/game-state";

const UI_DEBUG = false;

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