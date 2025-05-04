"use client";

import { Paperclip, ArrowUp, Router, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react";
import { GeneratingQuiz } from "@/business/entities/quiz";
import { useQuizStore } from "../../_stores/quiz-store";
import { useRouter } from "next/navigation";

export const CreateFromPrompt = () => {
    const { addQuiz } = useQuizStore();
    const router = useRouter();

    const handleGenerateQuiz = async (prompt: string) => {
        try {
            // const quiz = await generateQuiz(prompt);
            const generatingQuiz: GeneratingQuiz = {
                id: "generating",
                state: "generating",
            }

            addQuiz(generatingQuiz);
            router.push(`/dashboard/${generatingQuiz.id}`);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex flex-col h-full items-center justify-center">
            <PrompInput handleGenerateQuiz={handleGenerateQuiz} />
        </div>
    )
}

const PrompInput = ({ handleGenerateQuiz }: { handleGenerateQuiz: (prompt: string) => Promise<void> }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState("");

    const onSubmit = async () => {
        if (prompt === "" || prompt == null) return;
        setIsLoading(true);
        setTimeout(async () => {
            await handleGenerateQuiz(prompt);
            setIsLoading(false);
        }, 1000);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-2 flex flex-col w-full max-w-[500px] ${isLoading && "pointer-events-none"}`}
        >

            <div className="flex h-fit">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="p-2 resize-none flex-grow focus:outline-none"
                    placeholder="Describe your quiz" />

                <div className="flex gap-2 items-center h-fit">
                    <div className="flex gap-2">
                        <Paperclip size={24} className="text-gray-500" />
                    </div>

                    <button onClick={onSubmit} disabled={isLoading} className={`${isLoading && "opacity-50"} bg-primary h-fit text-white rounded-lg p-2`}>
                        {
                            isLoading
                                ?
                                <Loader2 className="animate-spin" size={24} />
                                :
                                <ArrowUp size={24} />
                        }
                    </button>
                </div>
            </div>
        </motion.div>
    )
}