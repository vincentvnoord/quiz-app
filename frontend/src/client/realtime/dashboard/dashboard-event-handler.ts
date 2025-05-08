import { useQuizStore } from "@/app/dashboard/_stores/quiz-store";
import { Quiz } from "@/business/entities/quiz";

export class DashboardEventHandler {
    private readonly store: typeof useQuizStore;

    constructor(store: typeof useQuizStore) {
        this.store = store;
    }

    onConnected() {
        console.log("Connected to dashboard");
    }

    onGeneratedQuiz(quiz: Quiz) {
        const state = this.store.getState();
        state.setQuizById(quiz.id, quiz);
    }
}