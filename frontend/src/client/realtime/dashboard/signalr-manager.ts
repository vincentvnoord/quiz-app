"use client";

import { RealtimeDashboardManager } from "./dashboard-manager";
import { IRealtimeDashboardManager } from "./dashboard-manager.interface";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { DashboardEventHandler } from "./dashboard-event-handler";

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

            this.registerEvents(this.connection, this.eventHandler);

            await this.connection.start();
            await this.connection.invoke("ConnectPlayer");
        } catch (error) {
            console.error("Connection failed:", error);
        }
    }

    private registerEvents(connection: HubConnection, handler: DashboardEventHandler) {
        
    }
}