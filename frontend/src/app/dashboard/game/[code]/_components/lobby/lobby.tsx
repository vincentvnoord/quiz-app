"use client";

import { PlayIcon } from "lucide-react";
import { GameCodes } from "./game-code"
import { QuitLobbyButton } from "./quit-lobby"
import { UserList } from "./user-list"

export const Lobby = () => {

    return (
        <div className="h-dvh flex flex-col">
            <div className="bg-white p-6">
                <h2 className="text-lg">Join now at <span className="font-extrabold text-2xl">example.com</span> with game pin or use the QR-code for mobile!</h2>
            </div>

            <GameCodes />

            <div className="h-full min-h-0 flex-shrink flex flex-col p-6 gap-4">
                <UserList />

                <div className="flex justify-end items-center gap-2">
                    <QuitLobbyButton />
                    <button className="flex items-center gap-2 flex-grow justify-center sm:flex-grow-0 sm:text-xl sm:p-6 sm:px-8 rounded-lg bg-primary text-white p-3 text-lg font-bold">
                        <PlayIcon fill="currentColor" strokeWidth={2} size={32} />
                        <span>
                            Start quiz
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}