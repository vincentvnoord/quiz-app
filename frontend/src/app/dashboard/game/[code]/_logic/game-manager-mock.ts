"use client";

import { GameStore } from "../_stores/game-store";
import { IGameManager } from "./game-manager";

export class GameManagerMock implements IGameManager {
    protected gameStore;

    constructor(store: GameStore) {
        this.gameStore = store;
    }

    getMinimumPlayers = () => 0;

    connectToGame(code: string): Promise<void> {
        this.gameStore.setGameCode(code);
        this.gameStore.setGameState("connecting");
        setTimeout(() => {
            this.gameStore.setGameState("lobby");
        }, 1000);
        return Promise.resolve();
    };

    closeLobby(): Promise<void> {
        return Promise.resolve();
    }

    startGame(): Promise<void> {
        this.gameStore.setGameState("starting");
        return Promise.resolve();
    }
}