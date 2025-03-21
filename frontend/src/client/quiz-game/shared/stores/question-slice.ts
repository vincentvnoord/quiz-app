import { StateCreator } from "zustand";

export type Question = {
    index: number;
    text: string;
    answers: string[];
    timeToAnswer: number;
}

export interface QuestionSlice {
    currentQuestion: Question | null;
    setCurrentQuestion: (question: Question | null) => void;
    correctAnswer: number | null;
    setCorrectAnswer: (correctAnswer: number) => void;
}

export const createQuestionSlice: StateCreator<QuestionSlice> = (set): QuestionSlice => ({
    currentQuestion: { index: 0, text: "", answers: [], timeToAnswer: 0 },
    setCurrentQuestion: (question) => set({ currentQuestion: question }),

    correctAnswer: null,
    setCorrectAnswer: (correctAnswer) => set({ correctAnswer }),
});