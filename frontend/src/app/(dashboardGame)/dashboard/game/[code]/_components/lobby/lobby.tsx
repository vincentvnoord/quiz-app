"use client";

import { GameCodes } from "./game-code"
import { CloseLobbyButton } from "./quit-lobby"
import { StartQuiz } from "./start-quiz";
import { UserList } from "./user-list"

export const Lobby = () => {

    return (
        <div className="h-dvh flex flex-col overflow-hidden">
            <div className="bg-white p-6">
                <h2 className="text-lg">Join now at <span className="font-extrabold text-2xl">quiz.vincentvnoord.dev</span> with game pin or use the QR-code for mobile!</h2>
            </div>

            <GameCodes />

            <div className="h-full overflow-hidden min-h-0 shrink flex flex-col p-6 gap-4">
                <UserList />

                <div className="flex justify-end items-center gap-2 relative z-0">
                    <CloseLobbyButton />
                    <StartQuiz />
                </div>
            </div>
        </div>
    )
}