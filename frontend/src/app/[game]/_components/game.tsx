"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { usePlayerGameStore } from "../../../client/quiz-game/player/stores/player-game-store";
import { ChooseNickName } from "./choose-nickname";
import { usePlayerStore } from "../../../client/quiz-game/player/stores/player-data-store";
import { motion } from "framer-motion";
import { PlayerLobby } from "./lobby";
import Connecting from "@/components/connecting";
import { Question } from "./question";
import { StartTimer } from "./start-timer";

export const PlayerGame = () => {
    const { gameManager, setState, state: { gameState } } = usePlayerGameStore();
    const { playerId, setPlayerId, forGame } = usePlayerStore();
    const params = useParams();

    useEffect(() => {
        if (!params.game) {
            console.error("No game code provided");
            return;
        }

        const gameCode = params.game as string;
        setState({ gameCode });

        if (!playerId) {
            setState({ gameState: "choose-name" });
            return;
        }

        if (forGame !== gameCode) {
            setPlayerId(null);
            setState({ gameState: "choose-name" });
            return;
        }

        if (gameManager == null)
            return;

        if (!playerId) {
            return;
        }

        gameManager.connectToGame(gameCode, playerId ?? "");
    }, [params.game, playerId, gameManager, forGame, setPlayerId, setState]);

    return (
        <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0 }} transition={{ delay: 0.1 }} className="w-full h-full">
            {gameState === "choose-name" && <ChooseNickName />}
            {gameState === "lobby" && <PlayerLobby />}
            {gameState === "starting" && <StartTimer />}
            {gameState === "connecting" && <Connecting />}
            {(gameState === "question" || gameState === "reveal-answer") && <Question />}
            {gameState === "results" && <div className="w-full h-dvh flex justify-center items-center text-5xl font-bold overflow-hidden">Results</div>}
        </motion.div>
    )
}