"use client";

import { Paperclip, ArrowUp, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react";
import { useQuizStore } from "../../_stores/quiz-store";
import { useRouter } from "next/navigation";
import { generateQuiz } from "../_actions";

export const CreateFromPrompt = () => {

    return (
        <div className="flex h-full items-center justify-center">
            <PrompInput />
        </div>
    )
}

const PrompInput = () => {
    const router = useRouter();
    const { addQuiz } = useQuizStore();

    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async () => {
        if (prompt === "" || prompt == null) return;
        setIsLoading(true);
        setError(null);
        try {
            const { quiz, error } = await generateQuiz(prompt);
            if (error) {
                setError(error);
            } else if (quiz) {
                addQuiz(quiz);
                router.push(`/dashboard/${quiz.id}`);
            }
        } catch (e) {
            console.error(e);
            setError("An error occurred while generating the quiz.");
        }

        setIsLoading(false);
    }

    return (
        <div className="flex flex-col gap-4 w-full items-center max-w-[500px]">
            <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={error ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: 10, height: 0 }}
                className="text-destructive overflow-hidden border-destructive border-2 rounded-lg w-full">
                <div className="flex p-2 items-center gap-2">
                    <AlertCircle size={24} />
                    <p>{error}</p>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-2 flex flex-col w-full ${isLoading && "pointer-events-none"}`}
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
        </div>
    )
}