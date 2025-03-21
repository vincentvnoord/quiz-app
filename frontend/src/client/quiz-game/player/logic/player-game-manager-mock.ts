import { usePlayerGameStore } from "../stores/player-game-store";
import { GameEventHandler } from "./game-event-handler";
import { IGameManager } from "./player-game-manager";


export class PlayerGameManagerMock implements IGameManager {
    private gameEventHandler: GameEventHandler | null = null;

    private readonly gameStore;

    constructor(store: typeof usePlayerGameStore) {
        this.gameStore = store;
    }

    answerQuestion(answer: number) {
        const store = this.gameStore.getState();
        const currentQuestion = store.currentQuestion;
        if (!currentQuestion || currentQuestion.pickedAnswer !== undefined) {
            return;
        }

        store.setCurrentQuestion({ ...currentQuestion, pickedAnswer: answer });
    }

    connectToGame(code: string, playerId: string): Promise<void> {
        this.gameEventHandler = new GameEventHandler(this.gameStore);
        this.gameEventHandler.onQuestion({
            index: 0,
            text: "What is the capital of France?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            timeToAnswer: 10,
        });

        return Promise.resolve();
    };
}