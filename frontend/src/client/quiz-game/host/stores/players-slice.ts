import { StateCreator } from "zustand";

export type Player = {
    id: string;
    name: string;
}

export interface PlayerSlice {
    players: Player[];
    setPlayers: (players: Player[]) => void;
    addPlayer: (player: Player) => void;
    removePlayer: (playerId: string) => void;
}

export const createPlayerSlice: StateCreator<PlayerSlice> = (set): PlayerSlice => ({
    players: [],
    setPlayers: (players) => set({ players }),
    addPlayer: (player) => set((state: PlayerSlice) => {
        const updatedPlayers = state.players.some(p => p.id === player.id)
            ? state.players.map(p => p.id === player.id ? player : p)
            : [...state.players, player];

        return { players: updatedPlayers };
    }),
    removePlayer: (playerId) => set((state: PlayerSlice) => ({ players: state.players.filter((player) => player.id !== playerId) })),
});