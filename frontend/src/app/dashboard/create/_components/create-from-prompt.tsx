"use client";

import { Paperclip, ArrowUp, ChevronDown, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react";
import { Answer, Question } from "@/business/entities/quiz";

export const CreateFromPrompt = () => {
    const answers: Answer[] = [
        { id: "1", text: "France", isCorrect: false },
        { id: "2", text: "Germany", isCorrect: false },
        { id: "3", text: "Spain", isCorrect: true },
        { id: "4", text: "Italy", isCorrect: false },
    ]

    return (
        <div className="flex flex-col h-full relative items-center justify-center gap-8">
            <div className="flex gap-2 flex-col p-2 w-full max-w-[500px]">
                <h1 className="text-4xl font-bold">Quiz Title</h1>
                <div className="flex flex-col gap-2 overflow-y-scroll min-h-0">
                    <GeneratedQuestion question={{ id: "1", text: "What is the capital of the United States of America?", answers }} />
                    <GeneratedQuestion question={{ id: "1", text: "What is the capital of the United States of America?", answers }} />
                    <GeneratedQuestion question={{ id: "1", text: "What is the capital of the United States of America?", answers }} />
                    <GeneratedQuestion question={{ id: "1", text: "What is the capital of the United States of America?", answers }} />
                    <GeneratedQuestion question={{ id: "1", text: "What is the capital of the United States of America?", answers }} />
                    <GeneratedQuestion question={{ id: "1", text: "What is the capital of the United States of America?", answers }} />
                </div>
            </div>
            <PrompInput />
        </div>
    )
}

const GeneratedQuestion = ({ question }: { question: Question }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <button onClick={() => setIsOpen(!isOpen)} className="flex cursor-pointer rounded-lg hover:bg-foreground/10 transition-colors duration-100 justify-between gap-2 p-2 w-full">
                <p>This is a question, mark?</p>
                <motion.div
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
                        <GeneratedAnswer key={answer.id} answer={answer} />
                    ))}
                </div>
            </motion.div>
        </div>
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