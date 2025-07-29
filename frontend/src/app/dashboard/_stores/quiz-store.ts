import { Quiz } from "@/business/entities/quiz";
import { DashboardEventHandler } from "@/client/realtime/dashboard/dashboard-event-handler";
import { IRealtimeDashboardManager } from "@/client/realtime/dashboard/dashboard-manager.interface";
import { MockDashboardManager } from "@/client/realtime/dashboard/mock-manager";
import { create } from "zustand";

export interface QuizStore {
    realtimeManager: IRealtimeDashboardManager | null;

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
        quizList: state.quizList.map((q) => {
            if (q.id !== id) return q;
            if (q.state === "generating") {
                return { ...q, state: "loaded", ...quiz } as Quiz;
            }
            return { ...q, ...quiz } as Quiz;
        }),
    })),
    addQuiz: (quiz: Quiz) => set((state) => ({
        quizList: [quiz, ...state.quizList],
    })),
}));

const eventHandler = new DashboardEventHandler(useQuizStore);
useQuizStore.setState({
    realtimeManager: new MockDashboardManager(eventHandler)
})
