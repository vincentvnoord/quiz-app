"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useGameStore from "../_stores/game-store";
import { Lobby } from "./lobby/lobby";
import Connecting from "@/components/connecting";
import { StartingDisplay } from "@/components/starting-display";
import { GameNotFound } from "./game-not-found";
import { Question } from "./game/question";

export default function GameState() {
    const { gameState, gameManager, timer } = useGameStore();

    const params = useParams();

    useEffect(() => {
        if (!params.code) {
            console.error("No game code provided");
            return;
        }

        if (gameManager == null)
            return;

        const code = params.code as string;
        gameManager.connectToGame(code);
    }, [params.code, gameManager]);

    return (
        <>
            {gameState === "not-found" && <GameNotFound />}
            {gameState === "connecting" && <Connecting />}
            {
                gameState == "lobby" &&
                <motion.div initial={{ opacity: 0, translateY: -50 }} animate={{ opacity: 1, translateY: 0 }} className="h-full w-full overflow-hidden">
                    <Lobby />
                </motion.div>
            }
            {gameState === "starting" && <StartingDisplay timer={timer} />}
            {(gameState === "question" || gameState === "reveal-answer") && <Question />}
            {gameState === "results" && <div className="w-full h-dvh flex justify-center items-center text-5xl font-bold overflow-hidden">Results</div>}
        </>
    )
}