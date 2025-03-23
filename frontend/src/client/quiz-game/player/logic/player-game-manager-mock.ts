import { QuestionStateDto } from "../../shared/stores/game-state";
import { PlayerGameStateDto, usePlayerGameStore } from "../stores/player-game-store";
import { GameEventHandler } from "./game-event-handler";
import { IGameManager } from "./player-game-manager";


export class PlayerGameManagerMock implements IGameManager {
    private gameEventHandler: GameEventHandler | null = null;

    private readonly gameStore;

    constructor(store: typeof usePlayerGameStore) {
        this.gameStore = store;
    }

    answerQuestion(answer: number) {
        console.log("Answering question", answer);

        const store = this.gameStore.getState();
        const question = store.state.currentQuestion;
        if (question === null) {
            return;
        }

        this.gameStore.getState().setState({ currentQuestion: { ...question, hasAnswered: true } });
        this.gameEventHandler?.onRevealAnswer({
            index: 0,
            playerAnswerResult: "no-answer",
        })
    }

    connectToGame(code: string, playerId: string): Promise<void> {
        this.gameEventHandler = new GameEventHandler(this.gameStore);

        console.log("Connected to game", code, playerId);

        this.gameEventHandler.onConnected(initialState);

        return Promise.resolve();
    };
}

const questions: QuestionStateDto[] = [
    {
        index: 0,
        text: "What is the capital of France?",
        answers: ["London", "Paris", "Berlin", "Madrid"],
        timeToAnswer: 10,
        hasAnswered: false,
    },
]

const initialState: PlayerGameStateDto = {
    gameCode: "",
    gameState: "question",
    timer: 0,
    currentQuestion: questions[0],
    correctAnswer: null,

    player: {
        id: "player-id",
        name: "Bart",
    },
}