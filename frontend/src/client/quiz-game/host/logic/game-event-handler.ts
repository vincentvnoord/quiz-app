import useHostStore, { HostGameStateDto, HostGameStore } from "../stores/host-store";
import { CorrectAnswer, Question } from "@/client/quiz-game/shared/stores/question-slice";
import { Player } from "../stores/players-slice";
import { startTimer } from "@/lib/timer";
import { QuestionStateDto } from "../../shared/stores/game-state";

export class GameEventHandler {
    private readonly gameStore: typeof useHostStore;

    constructor(store: typeof useHostStore) {
        this.gameStore = store;
    }

    onQuestion(question: QuestionStateDto) {
        const state = this.gameStore.getState();
        state.setState({ gameState: "question", currentQuestion: question, correctAnswer: null });
    }

    onRevealAnswer(correctAnswer: CorrectAnswer) {
        const state = this.gameStore.getState();
        state.setState({ gameState: "reveal-answer", correctAnswer });
    }

    onHostConnected(gameState: Partial<HostGameStateDto>) {
        const state = this.gameStore.getState();
        state.setState(gameState);
    }

    onGameNotFound() {
        const state = this.gameStore.getState();
        state.setState({ gameState: "not-found" });
    }

    onGameClosed() {
        console.log("Game closed");
        window.location.href = "/dashboard";
    }

    onPlayerJoined(player: Player) {
        const state = this.gameStore.getState();
        state.setState({ players: [...state.state.players, player] });
    }

    onPlayerDisconnected(playerId: string) {
        const state = this.gameStore.getState();
        state.setState({ players: state.state.players.filter(p => p.id !== playerId) });
    }

    onGameStarted(timer: number) {
        const state = this.gameStore.getState();
        state.setState({ gameState: "starting", timer });
    };

    onGameEnd() {
        const state = this.gameStore.getState();
        state.setState({ gameState: "results" });
    }
}