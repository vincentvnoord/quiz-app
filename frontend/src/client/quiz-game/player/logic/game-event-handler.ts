import { PlayerGameStateDto, usePlayerGameStore } from "../stores/player-game-store";
import { CorrectAnswerDto, QuestionStateDto } from "../../shared/stores/game-state";

export class GameEventHandler {
    private readonly gameStore: typeof usePlayerGameStore;

    constructor(store: typeof usePlayerGameStore) {
        this.gameStore = store;
    }

    onConnected(newState: PlayerGameStateDto) {
        const state = this.gameStore.getState();
        console.log("Connected to game with state: ", newState);

        state.setState(newState);
    }

    onQuestion(question: QuestionStateDto) {
        const state = this.gameStore.getState();
        console.log("Showing question", question);
        state.setState({ gameState: "question", currentQuestion: question, correctAnswer: null });
    }

    onRevealAnswer(correctAnswer: CorrectAnswerDto) {
        console.log(correctAnswer);
        const state = this.gameStore.getState();
        state.setState({ gameState: "reveal-answer", correctAnswer: correctAnswer });
    }

    onGameClosed() {
        console.log("Game closed");
        window.location.href = "/";
    }

    onGameEnd() {
        const state = this.gameStore.getState();
        state.setState({ gameState: "results" });
    }

    onGameStarted(timer: number) {
        const state = this.gameStore.getState();
        state.setState({ gameState: "starting", timer });
    };
}