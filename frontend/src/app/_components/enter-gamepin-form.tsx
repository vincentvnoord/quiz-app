"use client";

import { barriecieto } from "@/lib/fonts"
import { Input } from "@/components/Input"
import { motion } from "framer-motion";
import React from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";

export const EnterGamePinForm = () => {
    const router = useRouter();
    const [gamePin, setGamePin] = React.useState<string>("")
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<boolean>(false);

    const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGamePin(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (gamePin.length === 0)
            return;

        setLoading(true);

        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/" + gamePin);
            if (res.status === 200) {
                setSuccess(true);
                setError(null);
                setTimeout(() => {
                    router.push(`/${gamePin}`);
                }, 1000);

                return;
            } else if (res.status === 400) {
                setError("Please enter a valid Game PIN");
            } else if (res.status === 404) {
                setError("Game not found")
            } else if (res.status === 429) {
                setError("Too many tries, please try again later");
            }
        } catch (e) {
            setError("Something went wrong, please try again later");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-[360px] rounded-xl flex flex-col">
            <Input data-test="enter-game-pin" onChange={handlePinChange} value={gamePin} placeholder="Game PIN" className="justify-center font-semibold" error={false} valid={false} />
            <motion.div animate={loading ? { scale: 0.9, opacity: 0.7 } : { scale: 1 }} className="w-full mt-2">
                <button data-test="join-game" className={`bg-primary text-white ${barriecieto.className} text-4xl w-full p-2 rounded-xl`}>
                    {loading ? "LOADING" : "JOIN"}
                </button>
            </motion.div>
            <motion.div initial={{ opacity: 0, height: 0, padding: 0 }} className="overflow-hidden" animate={error ? { opacity: 1, height: "auto", paddingTop: 5 } : { opacity: 0, height: 0 }}>
                <p data-test="join-game-error" className="text-red-500 text-center">{error}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, height: 0, padding: 0 }} className="overflow-hidden flex items-center justify-center" animate={success && !error ? { opacity: 1, height: "auto", paddingTop: 5 } : { opacity: 0, height: 0 }}>
                <CheckIcon className="text-positive" />
                <p className="text-positive text-center">Sending you to game!</p>
            </motion.div>
        </form>
    )
}