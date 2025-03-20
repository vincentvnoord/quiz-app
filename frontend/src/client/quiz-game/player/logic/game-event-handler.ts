import { Question } from "@/client/quiz-game/shared/stores/question-slice";
import { PlayerGameStore, usePlayerGameStore } from "../stores/player-game-store";

export class GameEventHandler {
    private readonly gameStore: typeof usePlayerGameStore;

    constructor(store: typeof usePlayerGameStore) {
        this.gameStore = store;
    }

    onConnected(newState: Partial<PlayerGameStore>) {
        const state = this.gameStore.getState();

        const updates = {
            gameState: newState.gameState ?? state.gameState,
            title: newState.title ?? state.title,
            questionCount: newState.questionCount ?? state.questionCount,
            correctAnswer: newState.correctAnswer ?? -1,
            currentQuestion: newState.currentQuestion ?? state.currentQuestion,
            timer: newState.timer ?? 5,
        }

        this.gameStore.setState(updates);
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