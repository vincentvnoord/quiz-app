"use client";

import useHostStore, { HostGameStore } from "../stores/host-store";
import { GameEventHandler } from "./game-event-handler";
import { IGameManager } from "./game-manager";

export class GameManagerMock implements IGameManager {
    protected gameStore: HostGameStore;
    private readonly gameEventHandler: GameEventHandler;
    private currentQuestionIndex: number = 0;

    constructor(store: typeof useHostStore) {
        this.gameStore = store.getState();
        this.gameEventHandler = new GameEventHandler(store);
        store.subscribe((state) => {
            console.log("State changed", state);
            this.gameStore = state;
        });
    }

    getMinimumPlayers = () => 0;

    connectToGame(code: string): Promise<void> {
        console.log("Connected to game", code);

        setTimeout(() => {
            // Set complete state of the game store
        }, 100);


        return Promise.resolve();
    };

    closeLobby(): Promise<void> {
        return Promise.resolve();
    }

    startGame(): Promise<void> {
        const delay = 1;
        this.gameEventHandler.onGameStarted(delay);

        setTimeout(() => {
            this.showQuestion()
        }, delay * 1000);

        return Promise.resolve();
    }

    continue(): Promise<void> {
        console.log(this.gameStore);
        if (this.gameStore.state.gameState !== "reveal-answer")
            return Promise.resolve();

        this.showQuestion();

        return Promise.resolve();
    };

    showQuestion() {
        if (this.currentQuestionIndex >= this.gameStore.state.questionCount) {
            this.gameEventHandler.onGameEnd();
            return;
        }

        const question = mockQuiz.questions[this.currentQuestionIndex];
        console.log("Showing question", question);
        this.gameEventHandler.onQuestion(
            {
                index: this.currentQuestionIndex, ...question,
                hasAnswered: false
            }
        );

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.gameEventHandler.onRevealAnswer({ index: question.correctAnswer });
        }, question.timeToAnswer * 1000);
    }
}

const mockQuiz = {
    title: "Client Mock :)",
    questionCount: 5,
    players: [
        {
            id: "1",
            name: "Player 1"
        },
        {
            id: "2",
            name: "Player 2"
        }
    ],
    questions: [
        {
            text: "What is the capital of France?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correctAnswer: 0,
            timeToAnswer: 3,
        },
        {
            text: "How is electricity measured?",
            answers: ["Watts", "Volts", "Amps", "Joules"],
            correctAnswer: 2,
            timeToAnswer: 3
        },
        {
            text: "What is the capital of Spain?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correctAnswer: 3,
            timeToAnswer: 3
        },
        {
            text: "What is the capital of Italy?",
            answers: ["Paris", "London", "Rome", "Madrid"],
            correctAnswer: 1,
            timeToAnswer: 3
        },
        {
            text: "What is the capital of Portugal?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correctAnswer: 0,
            timeToAnswer: 3
        }
    ]
}