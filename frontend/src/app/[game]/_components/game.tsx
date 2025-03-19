"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { usePlayerGameStore } from "../_stores/game-store";
import { ChooseNickName } from "./choose-nickname";
import { usePlayerStore } from "../_stores/player-store";
import { motion } from "framer-motion";
import { PlayerLobby } from "./lobby";
import Connecting from "@/components/connecting";
import { Question } from "./question";
import { StartingDisplay } from "@/components/starting-display";

export const PlayerGame = () => {
    const { setGameCode, gameState, setGameState, gameManager, timer } = usePlayerGameStore();
    const { playerId, setPlayerId, forGame } = usePlayerStore();
    const params = useParams();

    useEffect(() => {
        if (!params.game) {
            console.error("No game code provided");
            return;
        }

        const gameCode = params.game as string;
        setGameCode(gameCode);

        if (!playerId) {
            setGameState("choose-name");
            return;
        }

        if (forGame !== gameCode) {
            setPlayerId(null);
            setGameState("choose-name");
            return;
        }

        if (gameManager == null)
            return;

        gameManager.connectToGame(gameCode, playerId);

    }, [params.game, playerId, gameManager]);

    return (
        <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0 }} transition={{ delay: 0.1 }} className="w-full h-full">
            {gameState === "choose-name" && <ChooseNickName />}
            {gameState === "lobby" && <PlayerLobby />}
            {gameState === "starting" && <StartingDisplay timer={timer} />}
            {gameState === "connecting" && <Connecting />}
            {(gameState === "question" || gameState === "reveal-answer") && <Question />}
            {gameState === "results" && <div className="w-full h-dvh flex justify-center items-center text-5xl font-bold overflow-hidden">Results</div>}
        </motion.div>
    )
}