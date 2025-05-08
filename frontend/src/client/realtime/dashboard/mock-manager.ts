"use client";

import { RealtimeDashboardManager } from "./dashboard-manager";
import { IRealtimeDashboardManager } from "./dashboard-manager.interface";
import { DashboardEventHandler } from "./dashboard-event-handler";

export class MockDashboardManager extends RealtimeDashboardManager implements IRealtimeDashboardManager {
    constructor(eventHandler: DashboardEventHandler) {
        super(eventHandler);
    }

    async connect() {
        this.registerEvents();
    }

    private registerEvents() {
        const handler = this.eventHandler;

        handler.onGeneratedQuiz({
            id: "generating",
            title: "Generated Quiz",
            state: "loaded",
            questions: []
        })
    }
}