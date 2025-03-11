"use client";

import { barriecieto } from "@/lib/fonts"
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlayerGameStore } from "../_stores/game-store";
import { ChooseNickName } from "./choose-nickname";
import { usePlayerStore } from "../_stores/player-store";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { motion } from "framer-motion";
import { PlayerLobby } from "./lobby";
import Connecting from "@/components/connecting";

export const PlayerGame = () => {
    const router = useRouter();
    const { setGameCode, gameState, setGameState } = usePlayerGameStore();
    const { playerId, setConnection, setPlayerId, setPlayerName, setForGame, forGame, connection } = usePlayerStore();
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

        const gameCode = params.game as string;
        setGameCode(gameCode);

        if (!playerId) {
            setGameState("choose-name");
            return;
        }

        if (forGame !== gameCode) {
            setPlayerId(null);
            return;
        }

        if (connection)
            return;

        const createConnection = async () => {
            try {
                const newConnection = new HubConnectionBuilder()
                    .withUrl(apiUrl + "/gamehub")
                    .withAutomaticReconnect()
                    .build();

                newConnection.on("GameNotFound", () => {
                    router.push("/");
                });

                newConnection.on("NonRegisteredPlayer", () => {
                    setGameState("choose-name");
                });

                newConnection.on("Connected", (player: string) => {
                    setForGame(gameCode);
                    setPlayerName(player);
                    setGameState("lobby");
                });

                await newConnection.start();
                await newConnection.invoke("ConnectPlayer", gameCode, playerId);

                setConnection(newConnection);
            } catch (e) {
                console.log(e);
            }
        }

        setGameState("connecting");
        createConnection();
    }, [params.game, playerId]);

    return (
        <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0 }} transition={{ delay: 0.1 }} className="w-full h-full">
            {
                gameState === "lobby" && <PlayerLobby />
            }
            {
                gameState === "choose-name" && <ChooseNickName />
            }
            {
                gameState === "connecting" &&
                <Connecting />
            }
        </motion.div>
    )
}