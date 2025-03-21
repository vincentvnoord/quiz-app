import useHostStore, { HostStore } from "../stores/host-store";
import { CorrectAnswer, Question } from "@/client/quiz-game/shared/stores/question-slice";
import { Player } from "../stores/players-slice";
import { startTimer } from "@/lib/timer";

export class GameEventHandler {
    private readonly gameStore: typeof useHostStore;

    constructor(store: typeof useHostStore) {
        this.gameStore = store;
    }

    onQuestion(question: Question) {
        const state = this.gameStore.getState();
        state.setGameState("question");
        state.setCurrentQuestion(question);
    }

    onRevealAnswer(correctAnswer: CorrectAnswer) {
        const state = this.gameStore.getState();
        state.setGameState("reveal-answer");
        state.setCorrectAnswer(correctAnswer);
    }

    onHostConnected(gameState: Partial<HostStore>) {
        const state = this.gameStore.getState();

        const updates = {
            gameState: gameState.gameState ?? state.gameState,
            title: gameState.title ?? state.title,
            questionCount: gameState.questionCount ?? state.questionCount,
            correctAnswer: gameState.correctAnswer,
            currentQuestion: gameState.currentQuestion ?? state.currentQuestion,
            timer: gameState.timer ?? 5,
            players: gameState.players ?? state.players,
        }

        if (gameState.gameState === "starting") {
            startTimer(gameState.timer ?? 5, (currentTime: number) => state.setTimer(currentTime));
        }

        this.gameStore.setState(updates);
    }

    onGameNotFound() {
        const state = this.gameStore.getState();
        state.setGameState("not-found");
    }

    onGameClosed() {
        console.log("Game closed");
        window.location.href = "/dashboard";
    }

    onPlayerJoined(player: Player) {
        const state = this.gameStore.getState();
        state.addPlayer(player);
    }

    onPlayerDisconnected(playerId: string) {
        const state = this.gameStore.getState();
        state.removePlayer(playerId);
    }

    onGameStarted(timer: number) {
        const state = this.gameStore.getState();
        state.setGameState("starting");

        startTimer(timer, (currentTime: number) => state.setTimer(currentTime));
    };

    onGameEnd() {
        const state = this.gameStore.getState();
        state.setGameState("results");
    }
}