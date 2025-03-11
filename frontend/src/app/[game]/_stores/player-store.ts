import { HubConnection } from "@microsoft/signalr";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerStore {
    forGame: string | null;
    setForGame: (game: string) => void;

    playerName: string;
    setPlayerName: (playerName: string) => void;

    playerId: string | null;
    setPlayerId: (playerId: string | null) => void;

    connection: HubConnection | null;
    setConnection: (connection: HubConnection | null) => void;
}

export const usePlayerStore = create<PlayerStore>()(
    persist(
        (set) => ({
            forGame: null,
            setForGame: (game) => set({ forGame: game }),

            connection: null,
            setConnection: (connection) => set({ connection }),

            playerId: null,
            setPlayerId: (id) => {
                console.log("Setting player ID", id);
                set({ playerId: id })
            },

            playerName: "",
            setPlayerName: (name) => {
                console.log("Setting player name", name);
                set({ playerName: name })
            },
        }),
        {
            name: "player-store", // Key for localStorage
            partialize: (state) => ({
                forGame: state.forGame,
                playerId: state.playerId,
                playerName: state.playerName, // ✅ Persist only playerId & playerName
            }),
        }
    )
);