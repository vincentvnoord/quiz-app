import useHostStore from "@/client/quiz-game/host/stores/host-store";
import { StartingDisplay } from "@/components/starting-display"
import { startTimer } from "@/lib/timer";
import { useEffect, useState } from "react";

export const StartTimer = () => {
    const { state: { timer } } = useHostStore();
    const [timeLeft, setTimeLeft] = useState(Math.ceil(timer / 1000));

    useEffect(() => {
        startTimer(timer, (currentTime: number) => setTimeLeft(currentTime));
    }, [timer]);

    return (
        <div className="w-full h-dvh flex item-center justify-center">
            <StartingDisplay timer={timeLeft} />
        </div>
    )
}