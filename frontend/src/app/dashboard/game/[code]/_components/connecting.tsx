"use client";

import { barriecieto } from "@/lib/fonts"
import { RefreshCcw, RefreshCw } from "lucide-react"
import { motion } from "framer-motion";

export default function Connecting() {

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <div className="flex flex-col relative items-center justify-center">
                <div className="top-0 left-0 absolute w-full h-full flex justify-center items-center">
                    <motion.p
                        initial={{ translateY: 0 }}
                        animate={{ translateY: [-5, 5, -5] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                        className={`text-black/50 text-3xl ${barriecieto.className}`}>Connecting</motion.p>
                </div>
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <RefreshCw
                        size={250}
                        stroke="white"
                        fill="transparent"
                        strokeWidth={1.5}
                    />
                </motion.div>
            </div>
        </div>
    )
}