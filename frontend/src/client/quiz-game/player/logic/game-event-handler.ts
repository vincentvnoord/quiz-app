import { Question } from "@/client/quiz-game/shared/stores/question-slice";
import { PlayerGameStore, usePlayerGameStore } from "../stores/player-game-store";
import { startTimer } from "@/lib/timer";

export class GameEventHandler {
    private readonly gameStore: typeof usePlayerGameStore;

    constructor(store: typeof usePlayerGameStore) {
        this.gameStore = store;
    }

    onConnected(newState: Partial<PlayerGameStore>) {
        const state = this.gameStore.getState();
        console.log("Connected to game with state: ", newState);

        const updates = {
            gameState: newState.gameState ?? state.gameState,
            title: newState.title ?? state.title,
            questionCount: newState.questionCount ?? state.questionCount,
            correctAnswer: newState.correctAnswer ?? -1,
            currentQuestion: newState.currentQuestion ?? state.currentQuestion,
        }

        if (newState.gameState === "starting") {
            startTimer(newState.timer ?? 5, (currentTime: number) => state.setTimer(currentTime));
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
        startTimer(timer, (currentTime: number) => state.setTimer(currentTime));
    };
}