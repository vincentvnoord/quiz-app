import { Question } from "@/client/quiz-game/shared/stores/question-slice";
import { usePlayerGameStore } from "../stores/player-game-store";

export class GameEventHandler {
    private readonly gameStore: typeof usePlayerGameStore;

    constructor(store: typeof usePlayerGameStore) {
        this.gameStore = store;
    }

    onConnected(player: string) {
        const gameStore = this.gameStore.getState();

        gameStore.setGameState("lobby");
    }

    onQuestion(question: Question) {
        const state = this.gameStore.getState();
        state.setGameState("question");
        state.setCurrentQuestion(question);
    }

    onRevealAnswer(correctAnswer: number) {
        const state = this.gameStore.getState();
        state.setGameState("reveal-answer");
        state.setCorrectAnswer(correctAnswer);
    }

    onGameClosed() {
        console.log("Game closed");
        window.location.href = "/";
    }

    onGameEnd() {
        const state = this.gameStore.getState();
        state.setGameState("results");
    }

    onGameStarted(timer: number) {
        const state = this.gameStore.getState();
        state.setGameState("starting");
        state.setTimer(timer);

        let remainingTime = timer;

        const interval = setInterval(() => {
            remainingTime--;

            if (remainingTime <= 0) {
                clearInterval(interval);
            } else {
                state.setTimer(remainingTime);
            }
        }, 1000);
    };
}