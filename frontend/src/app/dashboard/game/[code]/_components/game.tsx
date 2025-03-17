"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useGameStore from "../_stores/game-store";
import { Lobby } from "./lobby/lobby";
import Connecting from "@/components/connecting";
import { StartingDisplay } from "./game/starting";
import { GameNotFound } from "./game-not-found";

export default function Game() {
    const { gameState, gameManager } = useGameStore();

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
            {gameState === "starting" && <StartingDisplay />}
            {gameState === "question" && <div>Question</div>}
            {gameState === "reveal-answer" && <div>Reveal Answer</div>}
            {gameState === "results" && <div>Results</div>}
        </>
    )
}