export type BaseGameState = "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results" | "not-found";

export interface GameStateDto {
    timer: number;
    currentQuestion: QuestionStateDto | null;
    correctAnswer: CorrectAnswerDto | null;
}

export type PlayerDto = {
    id: string;
    name: string;
}

export type QuestionStateDto = {
    index: number;
    text: string;
    answers: string[];
    timeToAnswer: number;
    hasAnswered: boolean;
}

export type CorrectAnswerDto = {
    index: number;
    playerAnswerResult?: "correct" | "incorrect" | "no-answer";
}