"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useGameStore from "./game-store";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { Lobby } from "./lobby/lobby";
import Connecting from "./connecting";
import { Ban, Undo2 } from "lucide-react";
import Link from "next/link";

type GameState = {
    title: string;
    questionCount: number;
}

export default function Game() {
    const [connected, setConnected] = useState(false);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [gameNotFound, setGameNotFound] = useState(false);
    const { setGameCode, setTitle, setQuestionCount } = useGameStore();

    const params = useParams();

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
                const newConnection = new HubConnectionBuilder()
                    .withUrl(apiUrl + "/gamehub")
                    .withAutomaticReconnect()
                    .build();

                newConnection.on("HostConnected", (state: GameState) => {
                    console.log(state);
                    setTitle(state.title);
                    setQuestionCount(state.questionCount);

                    setConnected(true);
                })

                newConnection.on("GameNotFound", () => {
                    setGameNotFound(true);
                });

                await newConnection.start();
                await newConnection.invoke("ConnectHost", code);

                setConnection(newConnection);
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
                    <Lobby />
                    :
                    <Connecting />
            }
        </>
    )
}