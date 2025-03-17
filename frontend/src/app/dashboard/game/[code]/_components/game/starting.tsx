import { barriecieto } from "@/lib/fonts"
import useGameStore from "../../_stores/game-store";

export const StartingDisplay = () => {
    const { timer } = useGameStore();

    return (
        <div className="h-dvh flex flex-col overflow-hidden items-center justify-center gap-4">
            <h1 className={`${barriecieto.className} text-5xl`}>Get Ready</h1>
            <p className={`font-extrabold bg-primary p-2 aspect-square text-center rounded-lg text-white text-7xl`}>
                {timer}
            </p>
        </div>
    )
}