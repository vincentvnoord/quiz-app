"use client";

import { Paperclip, ArrowUp } from "lucide-react"
import { motion } from "framer-motion"

export const CreateFromPrompt = () => {

    return (
        <div className="flex flex-col h-dvh relative items-center justify-center gap-8">
            <PrompInput />
        </div>
    )
}

const PrompInput = () => {

    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-2 flex flex-col w-full max-w-[500px]"
        >

            <div className="flex h-fit">
                <textarea
                    className="p-2 resize-none flex-grow focus:outline-none"
                    placeholder="Describe your quiz" />

                <div className="flex gap-2 items-center h-fit">
                    <div className="flex gap-2">
                        <Paperclip size={24} className="text-gray-500" />
                    </div>

                    <button className="bg-primary h-fit text-white rounded-lg p-2">
                        <ArrowUp size={24} />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}