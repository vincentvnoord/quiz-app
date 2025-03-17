import { GameStore, Player } from "../_stores/game-store";

export class GameEventHandler {
    private readonly gameStore: GameStore;

    constructor(store: GameStore) {
        this.gameStore = store;
    }

    onQuestion(question: string, answers: string[], timeToAnswer: number) {
        this.gameStore.setGameState("question");
        this.gameStore.setCurrentQuestion({ text: question, answers, timeToAnswer });
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