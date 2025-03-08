"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useGameStore from "./game-store";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { Lobby } from "./lobby/lobby";
import Connecting from "./connecting";

export default function Game() {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const { setGameCode, setTitle } = useGameStore();

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

                newConnection.on("HostConnected", (quizTitle: string) => {
                    setTitle(quizTitle);
                })

                await newConnection.start();
                await newConnection.invoke("ConnectHost", code);

                // Debug timeout (to test out animations and such)
                setTimeout(() => setConnection(newConnection), 2000);
            } catch (e) {
                console.log(e);
            }
        }

        createConnection();

    }, [params.code]);
    
    return (
        <>
            {
                connection ?
                    <Lobby />
                    :
                    <Connecting />
            }
        </>
    )
}