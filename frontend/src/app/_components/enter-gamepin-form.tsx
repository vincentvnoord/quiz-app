"use client";

import { barriecieto } from "@/lib/fonts"
import { Input } from "@/components/Input"
import { motion } from "framer-motion";
import React from "react";
import { useRouter } from "next/navigation";

export const EnterGamePinForm = () => {
    const router = useRouter();
    const [gamePin, setGamePin] = React.useState<string>("")
    const [loading, setLoading] = React.useState<boolean>(false);

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGamePin(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            setTimeout(() => {
                setLoading(false)
            }, 2000);

            router.push(`/${gamePin}`)
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-[360px] rounded-xl flex flex-col gap-4">
            <Input onChange={handlePinChange} value={gamePin} placeholder="Game PIN" className="justify-center font-semibold" error={false} valid={false} />
            <motion.div animate={loading ? { scale: 0.9, opacity: 0.7 } : { scale: 1 }} className="w-full">
                <button className={`bg-primary text-white ${barriecieto.className} text-4xl w-full p-2 rounded-xl`}>
                    {loading ? "LOADING" : "JOIN"}
                </button>
            </motion.div>
        </form>
    )
}