import { QuizDisplay } from "@/business/entities/quiz";
import { create } from "zustand";

export interface QuizStore {
    quizList: QuizDisplay[];
    setQuizList: (quizzes: QuizDisplay[]) => void;
}

export const useQuizStore = create<QuizStore>()((set) => ({
    quizList: [],
    setQuizList: (quizzes) => set({ quizList: quizzes }),
}));