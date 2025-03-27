"use client";

import { AlertCircleIcon } from "lucide-react";
import { createGame } from "../_actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export const CreateGame = ({ children, quizId }: { children?: React.ReactNode, quizId: string }) => {
    const router = useRouter();

    const [activeGameSession, setActiveGameSession] = useState(true);
    const [gameId, setGameId] = useState<null | string>(null);

    const onClick = async () => {
        try {
            const res = await createGame(false, quizId);
            if (res?.activeGameSession) {
                setGameId(res.code);
                setActiveGameSession(true);
            } else {
                const code = res?.code;
                router.push(`/dashboard/game/${code}`);
            }
        } catch (e) {
            console.error("Error starting lobby: ", e);
        }
    }

    return (
        <>
            <button data-test="create-game" onClick={onClick} className="w-full">
                {children}
            </button>
            <ActiveGameSessionMessage activeGameSession={activeGameSession} gameId={gameId} quizId={quizId} />
        </>
    )
}

const ActiveGameSessionMessage = ({ activeGameSession, gameId, quizId }: { activeGameSession: boolean, gameId: string | null, quizId: string }) => {
    const router = useRouter();
    const showModal = activeGameSession && gameId !== null;

    const keepAndJoin = () => {
        router.push(`/dashboard/game/${gameId}`);
    }

    const terminateAndCreateNew = async () => {
        try {
            const res = await createGame(true, quizId);
            if (res?.code) {
                router.push(`/dashboard/game/${res.code}`);
            }
        } catch (e) {
            console.error("Error terminating game session: ", e);
        }
    }

    return (
        <div className={`inset-0 p-2 z-50 fixed justify-center items-center flex ${showModal ? "pointer-events-auto" : "pointer-events-none"}`}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={showModal && { opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="z-10 bg-white max-w-[450px] flex flex-col gap-4 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                    <AlertCircleIcon className="text-destructive" size={32} />
                    <h1 className="text-2xl font-bold">Active game session</h1>
                </div>
                <p className="">There is already an active game session. Do you want to terminate it and start a new one?</p>
                <div className="flex flex-col sm:flex-row justify-between pt-2 gap-2">
                    <button onClick={keepAndJoin} className="bg-positive p-3 rounded-lg text-white font-bold">Keep and join game</button>
                    <button data-test="create-and-terminate" onClick={terminateAndCreateNew} className="bg-destructive p-3 rounded-lg text-white font-bold">Terminate and create new</button>
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={showModal && { opacity: 1 }} className="bg-black/50 fixed inset-0">
            </motion.div>
        </div>
    )
}