"use client";

import { barriecieto } from "@/lib/fonts"
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlayerGameStore } from "../_stores/game-store";
import { ChooseNickName } from "./choose-nickname";
import { usePlayerStore } from "../_stores/player-store";
import { HubConnectionBuilder } from "@microsoft/signalr";

export const PlayerGame = () => {
    const router = useRouter();
    const { setGameCode, gameState, setGameState } = usePlayerGameStore();
    const { playerId, setConnection, setPlayerId, setPlayerName } = usePlayerStore();
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
                    setPlayerId(null);
                    setPlayerName("");
                });

                newConnection.on("Connected", (playerName: string) => {
                    setPlayerName(playerName);
                    setGameState("lobby");
                });

                await newConnection.start();
                await newConnection.invoke("ConnectPlayer", game, playerId);

                setConnection(newConnection);
            } catch (e) {
                console.log(e);
            }
        }

        if (!playerId) {
            setGameState("choose-name");
            return;
        }

        setGameState("connecting");
        createConnection();
    }, [params.game, playerId]);

    return (
        <>
            {
                gameState === "lobby" && <WaitingForHost />
            }
            {
                gameState === "choose-name" && <ChooseNickName />
            }
        </>
    )
}

const WaitingForHost = () => {
    const { playerName } = usePlayerStore();

    return (
        <div className="w-full h-full flex flex-col items-center pb-12 p-6 md:p-12">
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <h1 className={`${barriecieto.className} text-5xl text-primary`}>You're in!</h1>
                <p>Playing as <span className="font-bold">{playerName}</span></p>
            </div>
            <p className="text-xl font-bold">Waiting for host to start...</p>
        </div>
    )
}