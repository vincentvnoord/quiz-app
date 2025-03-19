import useGameStore from "../_stores/game-store";
import { Player } from "../_stores/players-slice";
import { Question } from "../_stores/question-slice";

export class GameEventHandler {
    private readonly gameStore: typeof useGameStore;

    constructor(store: typeof useGameStore) {
        this.gameStore = store;
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

    onHostConnected(gameState: { title: string, questionCount: number, players: Player[] }) {
        const state = this.gameStore.getState();
        state.setTitle(gameState.title);
        state.setQuestionCount(gameState.questionCount);
        state.setPlayers(gameState.players);
        state.setGameState("lobby");
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

    onGameEnd() {
        const state = this.gameStore.getState();
        state.setGameState("results");
    }
}