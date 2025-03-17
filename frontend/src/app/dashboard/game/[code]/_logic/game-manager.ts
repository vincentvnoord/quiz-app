import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { getUserTokenFromCookies } from "@/app/dashboard/_actions";
import { GameStore } from "../_stores/game-store";

export interface IGameManager {
    startGame: () => Promise<void>;
    connectToGame: (code: string) => Promise<void>;
    closeLobby: () => Promise<void>;
    getMinimumPlayers: () => number;
}

export class GameManager implements IGameManager {
    private gameCode: string | null = null;
    private connection: HubConnection | null = null;
    private readonly gameStore

    constructor(store: GameStore) {
        this.gameStore = store;
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

            this.connection.on("HostConnected", (state) => {
                this.gameStore.setTitle(state.title);
                this.gameStore.setQuestionCount(state.questionCount);
                this.gameStore.setPlayers(state.players);
                this.gameStore.setGameState("lobby");
            });

            this.connection.on("GameNotFound", () => this.gameStore.setGameState("not-found"));
            this.connection.on("GameClosed", () => {
                console.log("Game closed");
                window.location.href = "/dashboard"
            });
            this.connection.on("PlayerJoined", (player) => this.gameStore.addPlayer(player));
            this.connection.on("PlayerDisconnected", (playerId) => this.gameStore.removePlayer(playerId));

            await this.connection.start();
            await this.connection.invoke("ConnectHost", code);

            this.gameStore.setConnection(this.connection);
        } catch (error) {
            console.error("Connection failed:", error);
        }
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
