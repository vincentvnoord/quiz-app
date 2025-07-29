"use client";

import { RealtimeDashboardManager } from "./dashboard-manager";
import { IRealtimeDashboardManager } from "./dashboard-manager.interface";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

export class SignalrDashboardManager extends RealtimeDashboardManager implements IRealtimeDashboardManager {
    private connection: HubConnection | null = null;

    async connect() {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("API_URL is not set");
                return;
            }

            this.connection = new HubConnectionBuilder()
                .withUrl(apiUrl + `/gamehub`)
                .withAutomaticReconnect()
                .build();

            this.registerEvents();

            await this.connection.start();
            await this.connection.invoke("ConnectPlayer");
        } catch (error) {
            console.error("Connection failed:", error);
        }
    }

    private registerEvents() {
        if (!this.connection) {
            console.error("Connection is not established");
            return;
        }

        this.connection.on("QuizGenerated", (quiz) => {
            this.eventHandler.onGeneratedQuiz(quiz);
        });
    }
}