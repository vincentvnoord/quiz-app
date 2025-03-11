import { HubConnection } from "@microsoft/signalr";
import { create } from "zustand";

interface PlayerStore {
    playerName: string;
    setPlayerName: (playerName: string) => void;

    playerId: string | null;
    setPlayerId: (playerId: string | null) => void;

    connection: HubConnection | null;
    setConnection: (connection: HubConnection | null) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    playerName: "",
    setPlayerName: (playerName) => set({ playerName }),

    playerId: null,
    setPlayerId: (playerId) => set({ playerId }),

    connection: null,
    setConnection: (connection) => set({ connection }),
}));