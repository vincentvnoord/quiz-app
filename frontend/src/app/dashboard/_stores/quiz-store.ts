import { QuizDisplay } from "@/business/entities/quiz";
import { create } from "zustand";

export interface QuizStore {
    quizList: QuizDisplay[];
    setQuizList: (quizzes: QuizDisplay[]) => void;
}

export const useQuizStore = create<QuizStore>()((set) => ({
    quizList: [{
        id: "1",
        title: "Example quiz",
        questionCount: 5
    },
    {
        id: "2",
        title: "Example quiz 2",
        questionCount: 10
    },
    {
        id: "3",
        title: "Example quiz 3",
        questionCount: 15
    },
    {
        id: "4",
        title: "Example quiz 4",
        questionCount: 20
    },
    {
        id: "5",
        title: "Example quiz 5",
        questionCount: 25
    }
    ],
    setQuizList: (quizzes) => set({ quizList: quizzes }),
}));