import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { getUserTokenFromCookies } from "@/app/dashboard/_actions";
import { GameStore } from "../_stores/game-store";
import { GameEventHandler } from "./game-event-handler";

export interface IGameManager {
    startGame: () => Promise<void>;
    connectToGame: (code: string) => Promise<void>;
    closeLobby: () => Promise<void>;
    getMinimumPlayers: () => number;
    nextQuestion: () => Promise<void>;
}

export class GameManager implements IGameManager {
    private gameCode: string | null = null;
    private connection: HubConnection | null = null;
    private gameEventHandler: GameEventHandler | null = null;

    private readonly gameStore

    constructor(store: GameStore) {
        this.gameStore = store;
    }

    nextQuestion(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getMinimumPlayers = () => 2;

    async startGame() {
        if (this.connection) {
            await this.connection.invoke("StartGame");
        }
    };

    async connectToGame(code: string) {
        try {
            console.log("Connecting to game", code);
            this.gameCode = code;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("API_URL is not set");
                return;
            }

            const authToken = await getUserTokenFromCookies();
            this.connection = new HubConnectionBuilder()
                .withUrl(apiUrl + "/gamehub", {
                    accessTokenFactory: () => authToken
                })
                .withAutomaticReconnect()
                .build();

            this.gameEventHandler = new GameEventHandler(this.gameStore);
            this.registerEvents(this.connection, this.gameEventHandler);

            await this.connection.start();
            await this.connection.invoke("ConnectHost", code);
        } catch (error) {
            console.error("Connection failed:", error);
        }
    }

    private registerEvents(connection: HubConnection, handler: GameEventHandler) {
        // Host events
        connection.on("HostConnected", handler.onHostConnected);

        // Player events
        connection.on("PlayerJoined", handler.onPlayerJoined);
        connection.on("PlayerDisconnected", handler.onPlayerDisconnected);

        // Game state events
        connection.on("GameNotFound", handler.onGameNotFound);
        connection.on("GameClosed", handler.onGameClosed);
        connection.on("GameStarted", handler.onGameStarted);
    }

    async closeLobby() {
        const gameCode = this.gameCode;

        if (!gameCode) {
            console.error("No game code provided");
            return;
        }

        if (this.connection) {
            console.log("Closing game", gameCode);
            await this.connection.invoke("CloseGame", gameCode);
        }
    }

    disconnect() {
        if (this.connection) {
            this.connection.stop();
        }
    }
}
