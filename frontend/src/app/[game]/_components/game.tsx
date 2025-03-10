"use client";

import { barriecieto } from "@/lib/fonts"
import { useEffect, useState } from "react";
import { joinGame } from "../_actions";
import { useParams } from "next/navigation";
import { usePlayerGameStore } from "../game-store";
import { motion } from "framer-motion";

export const PlayerGame = () => {
    const { setGameCode } = usePlayerGameStore();
    const params = useParams();

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("API_URL is not set");
            return;
        }

        if (!params.game) {
            console.error("No game code provided");
            return;
        }

        const game = params.game as string;
        setGameCode(game);

        // Connection to SignalR hub

    }, [params.game]);

    return (
        <>
            {<ChooseNickName />}
        </>
    )
}

const ChooseNickName = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { gameCode, setPlayerId } = usePlayerGameStore();
    const [name, setName] = useState<string>("");

    const handleSubmit = async () => {
        if (name.length === 0) {
            return;
        }

        setLoading(true);
        try {
            const res = await joinGame(gameCode, name);
            if (res.success) {
                if (!res.playerId) {
                    setError("Failed to join game");
                    return;
                }

                setPlayerId(res.playerId);
                console.log(res.playerId);
            } else {
                if (!res.message) {
                    setError("Failed to join game");
                } else {
                    setError(res.message);
                }
            }
        } catch (e) {
            console.error(e);
        }

        setLoading(false);
    }

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    return (
        <div className="w-full h-full flex items-center justify-center pb-12 p-6 md:p-12">
            <div className="flex flex-col gap-4">
                <input value={name} onChange={onNameChange}
                    placeholder="Nickname"
                    className="w-full bg-white rounded-lg p-4 text-xl focus:outline-none"
                    type="text"
                />

                <motion.div
                    animate={loading ? { scale: 0.9 } : { scale: 1 }}
                >
                    <button onClick={handleSubmit} className={`bg-primary w-full text-white p-2 text-5xl rounded-lg ${barriecieto.className}`}>JOIN GAME</button>
                </motion.div>
            </div>
        </div>
    )
}

const WaitingForHost = () => {

    return (
        <div className="w-full h-full flex flex-col items-center pb-12 p-6 md:p-12">
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <h1 className={`${barriecieto.className} text-5xl text-primary`}>You're in!</h1>
                <p>Playing as <span className="font-bold">John Doe</span></p>
            </div>
            <p className="text-xl font-bold">Waiting for host to start...</p>
        </div>
    )
}