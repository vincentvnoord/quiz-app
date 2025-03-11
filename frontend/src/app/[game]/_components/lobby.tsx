import { usePlayerStore } from "../_stores/player-store";
import { barriecieto } from "@/lib/fonts";

export const PlayerLobby = () => {
    const { playerName } = usePlayerStore();

    return (
        <div className="w-full h-full flex flex-col items-center pb-12 p-6 md:p-12">
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <h1 className={`${barriecieto.className} text-5xl text-primary`}>You're in!</h1>
                <p>Playing as <span className="font-bold">{playerName}</span></p>
            </div>
            <p className="text-xl font-bold">Waiting for host to start...</p>
        </div>
    )
}