import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { GameEventHandler } from "./game-event-handler";
import { usePlayerGameStore } from "../stores/player-game-store";

export interface IGameManager {
    answerQuestion: (answer: number) => void;
    connectToGame: (code: string, playerId: string) => Promise<void>;
}

export class PlayerGameManager implements IGameManager {
    private gameCode: string | null = null;
    private connection: HubConnection | null = null;
    private gameEventHandler: GameEventHandler | null = null;

    private readonly gameStore

    constructor(store: typeof usePlayerGameStore) {
        this.gameStore = store;
    }

    answerQuestion(answer: number) {
        console.log("Answering question", answer);
    };


    async connectToGame(code: string, playerId: string) {
        try {
            console.log("Connecting to game", code);
            this.gameCode = code;
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            if (!apiUrl) {
                console.error("API_URL is not set");
                return;
            }

            this.connection = new HubConnectionBuilder()
                .withUrl(apiUrl + `/gamehub`)
                .withAutomaticReconnect()
                .build();

            this.gameEventHandler = new GameEventHandler(this.gameStore);
            this.registerEvents(this.connection, this.gameEventHandler);

            await this.connection.start();
            await this.connection.invoke("ConnectPlayer", code, playerId);
            console.log("Connected to game", code);
        } catch (error) {
            console.error("Connection failed:", error);
        }
    }

    private registerEvents(connection: HubConnection, handler: GameEventHandler) {
        // Game state events
        connection.on("GameNotFound", () => {
            window.location.href = "/";
        })

        connection.on("Connected", (state) => handler.onConnected(state));

        connection.on("GameClosed", () => handler.onGameClosed());
        connection.on("GameStarted", (state) => handler.onGameStarted(state));
        connection.on("GameEnd", () => handler.onGameEnd());

        connection.on("UnAuthorized", () => console.log("Unauthorized"));

        connection.on("Question", (question) => {
            console.log("Received question", question);
            handler.onQuestion(question)
        });

        connection.on("RevealAnswer", (correctAnswer) => handler.onRevealAnswer(correctAnswer));
    }
}
