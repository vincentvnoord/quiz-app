export type BaseGameState = "connecting" | "lobby" | "starting" | "question" | "reveal-answer" | "results";

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
}

export type CorrectAnswerDto = {
    index: number;
    playerAnswer?: "correct" | "incorrect" | "no-answer";
}