"use client";

import { RealtimeDashboardManager } from "./dashboard-manager";
import { IRealtimeDashboardManager } from "./dashboard-manager.interface";
import { DashboardEventHandler } from "./dashboard-event-handler";
import { Question } from "@/business/entities/quiz";

export class MockDashboardManager extends RealtimeDashboardManager implements IRealtimeDashboardManager {
    constructor(eventHandler: DashboardEventHandler) {
        super(eventHandler);
    }

    async connect() {
        this.registerEvents();
    }

    private registerEvents() {
        const handler = this.eventHandler;

        const question: Question = {
            id: "1",
            text: "What is the capital of France?",
            answers: [
                { id: "a", text: "Paris", isCorrect: true },
                { id: "b", text: "London", isCorrect: false },
            ],
        }

        handler.onGeneratedQuiz({
            id: "generating",
            title: "Generated Quiz",
            state: "loaded",
            questions: [question]
        })
    }
}