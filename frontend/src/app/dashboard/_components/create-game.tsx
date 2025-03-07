"use client";

import { createGame } from "../_actions";
import { useRouter } from "next/navigation";

export const CreateGame = () => {
    const router = useRouter();

    const onClick = async () => {
        try {
            const code = await createGame();
            router.push(`/dashboard/game/${code}`);
        } catch (e) {
            console.error("Error starting lobby: ", e);
        }
    }

    return (
        <button onClick={onClick} className="bg-primary mt-8 text-xl text-white font-bold w-fit p-3 rounded-xl">
            Create game
        </button>
    )
}