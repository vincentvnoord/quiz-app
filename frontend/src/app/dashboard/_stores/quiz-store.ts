import { Quiz } from "@/business/entities/quiz";
import { DashboardEventHandler } from "@/client/realtime/dashboard/dashboard-event-handler";
import { RealtimeDashboardManager } from "@/client/realtime/dashboard/dashboard-manager";
import { MockDashboardManager } from "@/client/realtime/dashboard/mock-manager";
import { create } from "zustand";

export interface QuizStore {
    realtimeManager: RealtimeDashboardManager | null;

    quizList: Quiz[];
    setQuizList: (quizzes: Quiz[]) => void;
    setQuizById: (id: string, quiz: Partial<Quiz>) => void;
    addQuiz: (quiz: Quiz) => void;
}

export const useQuizStore = create<QuizStore>()((set) => ({
    realtimeManager: null,
    quizList: [],
    setQuizList: (quizzes) => set({ quizList: quizzes }),
    setQuizById: (id, quiz) => set((state) => ({
        quizList: state.quizList.map((q) =>
            q.id === id && q.state === "loaded" ? { ...q, ...quiz } : q
        ),
    })),
    addQuiz: (quiz: Quiz) => set((state) => ({
        quizList: [quiz, ...state.quizList],
    })),
}));

const eventHandler = new DashboardEventHandler(useQuizStore);
useQuizStore.setState({
    realtimeManager: new MockDashboardManager(eventHandler)
})
