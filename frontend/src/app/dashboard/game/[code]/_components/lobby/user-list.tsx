"use client";

import { UserIcon } from "lucide-react"
import useGameStore from "../game-store";
import { motion } from "framer-motion";

export const UserList = () => {
    const { players, addPlayer, title } = useGameStore();

    return (
        <div className="flex min-h-0 flex-col gap-3 flex-grow">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <p className="text-2xl font-bold">{title}</p>
                    <p className="opacity-50">10 questions</p>
                </div>

                <div onClick={() => addPlayer("New Player1!!!!!")} className="flex items-center justify-center p-2 px-4 rounded-lg bg-black/10 text-white">
                    <UserIcon fill="white" stroke="transparent" size={28} />
                    <p className="text-2xl font-bold">{players.length}</p>
                </div>
            </div>

            <div className="h-[2px] bg-black/10"></div>

            <div className="grid min-h-0 pb-4 overflow-y-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {players.map((player, i) => <Player key={i} name={player} />)}
            </div>
        </div>

    )
}

const Player = ({ name }: { name: string }) => {

    return (
        <motion.div initial={{ opacity: 0, translateY: -100 }} animate={{ opacity: 1, translateY: 0 }} className="bg-black/10 p-3 py-4 rounded-lg">
            <p className="text-white font-bold text-xl">{name}</p>
        </motion.div>
    )
}