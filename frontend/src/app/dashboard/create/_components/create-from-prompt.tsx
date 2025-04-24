"use client";

import { Paperclip, ArrowUp, ChevronDown, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import { Answer, Question } from "@/business/entities/quiz";
import { generateQuiz } from "../_actions";

const timeOut = (delay: number, func: () => void) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            func();
            resolve(true);
        }, delay);
    });
}

export const CreateFromPrompt = () => {
    const [quizTitle, setQuizTitle] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);

    const handleGenerateQuiz = async (prompt: string) => {
        try {
            const quiz = await generateQuiz(prompt);
            setQuizTitle(quiz.title);
            setQuestions(quiz.questions);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex flex-col h-full relative items-center justify-center gap-8">
            <div className="flex gap-2 flex-col p-2 w-full max-w-[500px]">
                <motion.h1
                    initial={{ opacity: 0, y: -100, height: 0 }}
                    animate={quizTitle !== null ? { opacity: 1, y: 0, height: "auto" } : { opacity: 0, y: -100, height: 0 }}
                    transition={{ ease: "anticipate", duration: 1 }}
                    className="text-4xl font-bold">{quizTitle}</motion.h1>
                <div className="flex flex-col gap-2 overflow-y-scroll min-h-0">
                    {questions.map((question) => (
                        <GeneratedQuestion key={question.text} question={question} />
                    ))}
                </div>
            </div>
            <PrompInput handleGenerateQuiz={handleGenerateQuiz} />
        </div>
    )
}

const GeneratedQuestion = ({ question }: { question: Question }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            transition={{ ease: "anticipate", duration: 1 }}
            className="flex flex-col">
            <button onClick={() => setIsOpen(!isOpen)} className="flex text-left cursor-pointer rounded-lg hover:bg-foreground/10 transition-colors duration-100 justify-between gap-2 p-2 w-full">
                <p>{question.text}</p>
                <motion.div
                className="h-fit"
                    initial={{ rotate: 0 }}
                    animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                >
                    <ChevronDown size={24} className="text-gray-500 flex-shrink-0" />
                </motion.div>
            </button>

            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={isOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                className="overflow-hidden">
                <div className="grid grid-cols-2 gap-1 p-2 px-4">
                    {question.answers.map((answer) => (
                        <GeneratedAnswer key={answer.text} answer={answer} />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}

const GeneratedAnswer = ({ answer }: { answer: Answer }) => {
    const { text, isCorrect } = answer;

    return (
        <div className="border p-2 rounded-lg flex items-center justify-between">
            <p className="truncate">{text}</p>
            <Check className={`${isCorrect ? "opacity-100" : "opacity-0"} text-foreground/50 flex-shrink-0`} size={24} />
        </div>
    )
}

const PrompInput = ({ handleGenerateQuiz }: { handleGenerateQuiz: (prompt: string) => Promise<void> }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState("");

    const onSubmit = async () => {
        if (prompt === "" || prompt == null) return;
        setIsLoading(true);
        await handleGenerateQuiz(prompt);
        setIsLoading(false);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-2 flex flex-col w-full max-w-[500px]"
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
                        <ArrowUp size={24} />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}