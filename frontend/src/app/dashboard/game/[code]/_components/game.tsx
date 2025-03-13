"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useGameStore, { Player } from "./game-store";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Lobby } from "./lobby/lobby";
import Connecting from "../../../../../components/connecting";
import { Ban, Undo2 } from "lucide-react";
import Link from "next/link";
import { getUserTokenFromCookies } from "@/app/dashboard/_actions";

type GameState = {
    title: string;
    questionCount: number;
    players: Player[];
}

export default function Game() {
    const [connected, setConnected] = useState(false);
    const [gameNotFound, setGameNotFound] = useState(false);
    const { setGameCode, setTitle, setQuestionCount, setConnection, addPlayer, setPlayers, removePlayer } = useGameStore();

    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("API_URL is not set");
            return;
        }

        if (!params.code) {
            console.error("No game code provided");
            return;
        }

        const code = params.code as string;
        setGameCode(code);

        const createConnection = async () => {
            try {
                const authToken = await getUserTokenFromCookies();
                console.log("Auth token: ", authToken);
                const connection = new HubConnectionBuilder()
                    .withUrl(apiUrl + "/gamehub", {
                        accessTokenFactory: () => authToken
                    })
                    .withAutomaticReconnect()
                    .build();

                connection.on("HostConnected", (state: GameState) => {
                    console.log(state);
                    setTitle(state.title);
                    setQuestionCount(state.questionCount);
                    setPlayers(state.players);

                    setConnected(true);
                })

                connection.on("GameNotFound", () => setGameNotFound(true));
                connection.on("GameClosed", () => router.push("/dashboard"));
                connection.on("PlayerJoined", (player: Player) => addPlayer(player));
                connection.on("PlayerDisconnected", (playerId: string) => removePlayer(playerId));

                await connection.start();
                await connection.invoke("ConnectHost", code);

                setConnection(connection);
            } catch (e) {
                console.log(e);
            }
        }

        createConnection();

    }, [params.code]);

    if (gameNotFound) {
        return (
            <div className="h-full w-full gap-4 flex flex-col justify-center items-center">
                <div className="flex flex-col gap-2 items-center text-destructive p-6 rounded-2xl">
                    <Ban size={100} />
                    <h1 className="font-bold text-black text-2xl">Game not found</h1>
                </div>

                <Link href={"/dashboard"} className="flex gap-2 bg-white p-2 rounded-lg">
                    <Undo2 className="opacity-50" size={24} />
                    <p className="text-black/50 text-xl">
                        Back to dashboard
                    </p>
                </Link>
            </div>
        )
    }

    return (
        <>
            {
                connected ?
                    <motion.div initial={{ opacity: 0, translateY: -50 }} animate={{ opacity: 1, translateY: 0 }} className="h-full w-full">
                        <Lobby />
                    </motion.div>
                    :
                    <Connecting />
            }
        </>
    )
}