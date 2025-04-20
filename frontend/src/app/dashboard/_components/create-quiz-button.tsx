"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";

export const CreateQuizButton = ({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<"button">) => {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            {...props}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative w-full cursor-pointer">
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: hovered ? -10 : 0 }}
                whileTap={{ y: 0 }}
                className="relative bg-white flex z-20 gap-4 w-full rounded-xl border p-4 items-center text-xl font-semibold">
                {children}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hovered ? 1 : 0 }}
                className="absolute z-0 top-0 left-0 w-full h-full bg-secondary rounded-xl" />
        </button>
    )
}