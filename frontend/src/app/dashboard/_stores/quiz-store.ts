import { Quiz } from "@/business/entities/quiz";
import { create } from "zustand";

export interface QuizStore {
    quizList: Quiz[];
    setQuizList: (quizzes: Quiz[]) => void;

    setQuizById: (id: string, quiz: Partial<Quiz>) => void;
}

export const useQuizStore = create<QuizStore>()((set) => ({
    quizList: [],
    setQuizList: (quizzes) => set({ quizList: quizzes }),

    setQuizById: (id, quiz) => set((state) => ({
        quizList: state.quizList.map((q) => (q.id === id ? { ...q, ...quiz } : q)),
    })),
}));