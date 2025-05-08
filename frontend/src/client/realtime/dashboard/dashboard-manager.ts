import { DashboardEventHandler } from "./dashboard-event-handler";

export abstract class RealtimeDashboardManager {
    protected eventHandler: DashboardEventHandler;

    constructor(eventHandler: DashboardEventHandler) {
        this.eventHandler = eventHandler;
    }
}