"use client";

import { PlayIcon } from "lucide-react";
import useGameStore from "../../_stores/game-store";
import { useState } from "react";
import { motion } from "framer-motion";

export const StartQuiz = () => {
    const { gameManager, players } = useGameStore();
    const [showError, setShowError] = useState(false);
    const enoughPlayers = gameManager ? players.length >= gameManager?.getMinimumPlayers() : 2;

    const handleStart = async () => {
        if (!gameManager)
            return;

        if (!enoughPlayers) {
            if (showError)
                return;

            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
            return;
        }

        await gameManager.startGame();
    };

    const classes = "flex items-center gap-2 flex-grow justify-center sm:flex-grow-0 sm:text-xl rounded-lg text-white p-3 text-lg font-bold z-0";
    const animation = "transition-color duration-100 ease-in";

    return (
        <>
            <TooFewPlayersMessage show={showError} />
            <button onClick={handleStart}
                className={`${classes} ${animation} ${enoughPlayers ? "bg-primary" : "bg-black/20 opacity-60 cursor-not-allowed"}`}>
                <PlayIcon fill="currentColor" strokeWidth={2} size={32} />
                <span>
                    Start quiz
                </span>
            </button>
        </>
    )
}

const TooFewPlayersMessage = ({ show }: { show: boolean }) => {
    return (
        <motion.div
            initial={{ opacity: 0, translateX: 100 }}
            animate={show ? { opacity: 1, translateX: 0 } : { opacity: 0, translateX: 100 }}
            className="absolute bg-white right-0 bottom-16 overflow-hidden p-3 rounded-lg z-0">
            <p className="opacity-80 text-destructive text-sm">The quiz requires atleast 2 players to start</p>
        </motion.div>
    )
}