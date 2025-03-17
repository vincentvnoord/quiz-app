"use client";

import { GameStore, Question } from "../_stores/game-store";
import { GameEventHandler } from "./game-event-handler";
import { IGameManager } from "./game-manager";

export class GameManagerMock implements IGameManager {
    protected gameStore;
    private readonly gameEventHandler: GameEventHandler;

    constructor(store: GameStore) {
        this.gameStore = store;
        this.gameEventHandler = new GameEventHandler(store);
    }

    getMinimumPlayers = () => 0;

    connectToGame(code: string): Promise<void> {
        this.gameStore.setGameCode(code);
        this.gameStore.setGameState("connecting");

        setTimeout(() => {
            this.gameEventHandler.onHostConnected({
                ...mockQuiz
            })
        }, 100);


        return Promise.resolve();
    };

    closeLobby(): Promise<void> {
        return Promise.resolve();
    }

    startGame(): Promise<void> {
        this.mockGame();

        return Promise.resolve();
    }

    mockGame() {
        const delay = 1;
        this.gameEventHandler.onGameStarted(delay);

        setTimeout(() => {
            this.showQuestion(mockQuiz.questions, 0);
        }, delay * 1000);
    }

    showQuestion(questions: Question[], currentQuestion: number) {
        const length = questions.length;
        if (currentQuestion >= length) {
            this.gameEventHandler.onGameEnd();
            return;
        }

        const question = questions[currentQuestion];

        this.gameEventHandler.onQuestion(
            question.text,
            question.answers,
            question.timeToAnswer
        );

        setTimeout(() => {
            this.showQuestion(questions, currentQuestion + 1);
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
            timeToAnswer: 3
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
            answers: ["Paris", "London", "Berlin", "Madrid"],
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