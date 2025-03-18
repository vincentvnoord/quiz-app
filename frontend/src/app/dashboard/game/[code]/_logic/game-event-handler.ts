import { GameStore } from "../_stores/game-store";
import { Player } from "../_stores/players-slice";
import { Question } from "../_stores/question-slice";

export class GameEventHandler {
    private readonly gameStore: GameStore;

    constructor(store: GameStore) {
        this.gameStore = store;
    }

    onQuestion(question: Question) {
        this.gameStore.setGameState("question");
        this.gameStore.setCurrentQuestion(question);
    }

    onRevealAnswer(correctAnswer: number) {
        this.gameStore.setGameState("reveal-answer");
        this.gameStore.setCorrectAnswer(correctAnswer);
    }

    onHostConnected(state: { title: string, questionCount: number, players: Player[] }) {
        this.gameStore.setTitle(state.title);
        this.gameStore.setQuestionCount(state.questionCount);
        this.gameStore.setPlayers(state.players);
        this.gameStore.setGameState("lobby");
    }

    onGameNotFound() {
        this.gameStore.setGameState("not-found");
    }

    onGameClosed() {
        console.log("Game closed");
        window.location.href = "/dashboard";
    }

    onPlayerJoined(player: Player) {
        this.gameStore.addPlayer(player);
    }

    onPlayerDisconnected(playerId: string) {
        this.gameStore.removePlayer(playerId);
    }

    onGameStarted(delay: number) {
        this.gameStore.setGameState("starting");
        this.gameStore.setTimer(delay);

        let remainingTime = delay;

        const interval = setInterval(() => {
            remainingTime--;

            if (remainingTime <= 0) {
                clearInterval(interval);
            } else {
                this.gameStore.setTimer(remainingTime);
            }
        }, 1000);
    };

    onGameEnd() {
        this.gameStore.setGameState("results");
    }
}