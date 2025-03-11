import { useState } from "react";
import { usePlayerGameStore } from "../_stores/game-store";
import { joinGame } from "../_actions";
import { motion } from "framer-motion";
import { barriecieto } from "@/lib/fonts";
import { usePlayerStore } from "../_stores/player-store";

export const ChooseNickName = () => {
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { setPlayerId, setPlayerName } = usePlayerStore();
    const { gameCode } = usePlayerGameStore();

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

                setPlayerName(name);
                setPlayerId(res.playerId);
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
