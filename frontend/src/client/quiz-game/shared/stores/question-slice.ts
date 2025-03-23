import { StateCreator } from "zustand";


export type CorrectAnswer = {
    playerAnswer?: "correct" | "incorrect" | "no-answer";
    index: number;
}

export type Question = {
    index: number;
    text: string;
    answers: string[];
    timeToAnswer: number;
    pickedAnswer?: number;
}

export interface QuestionSlice {
    currentQuestion: Question | null;
    setCurrentQuestion: (question: Question | null) => void;

    correctAnswer: CorrectAnswer | null;
    setCorrectAnswer: (correctAnswer: CorrectAnswer | null) => void;
}

export const createQuestionSlice: StateCreator<QuestionSlice> = (set): QuestionSlice => ({
    currentQuestion: { index: 0, text: "", answers: [], timeToAnswer: 0 },
    setCurrentQuestion: (question) => set({ currentQuestion: question }),

    correctAnswer: null,
    setCorrectAnswer: (correctAnswer) => set({ correctAnswer }),
});