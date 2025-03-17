import { barriecieto } from "@/lib/fonts"
import { useEffect, useState } from "react"

export const StartingDisplay = () => {
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <div className="h-dvh flex flex-col overflow-hidden items-center justify-center gap-4">
            <h1 className={`${barriecieto.className} text-5xl`}>Get Ready</h1>
            <p className={`font-extrabold bg-primary p-2 aspect-square text-center rounded-lg text-white text-7xl`}>
                {timeLeft}
            </p>
        </div>
    )
}