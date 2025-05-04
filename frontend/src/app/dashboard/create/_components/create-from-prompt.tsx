"use client";

import { Paperclip, ArrowUp, ChevronDown, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react";
import { Answer, Question } from "@/business/entities/quiz";
import { generateQuiz } from "../_actions";

export const CreateFromPrompt = () => {
    const [quizTitle, setQuizTitle] = useState<string | null>("Cool quiz");
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: "1",
            text: "What is the capital of France?",
            answers: [
                { id: "1", text: "Paris", isCorrect: true },
                { id: "2", text: "London", isCorrect: false },
                { id: "3", text: "Berlin", isCorrect: false },
                { id: "4", text: "Madrid", isCorrect: false }
            ]
        }
    ]);

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
        <div className="flex flex-col h-full items-center justify-center">
            <div className="flex flex-col h-full w-full max-w-[500px] justify-center">
                <h1 className="text-2xl flex-shrink-0 font-bold">{quizTitle}</h1>

                <div className="flex flex-col gap-1 overflow-auto">
                    {questions.map((question) => (
                        <GeneratedQuestion key={question.id} question={question} />
                    ))}
                    {questions.map((question) => (
                        <GeneratedQuestion key={question.id} question={question} />
                    ))}
                    {questions.map((question) => (
                        <GeneratedQuestion key={question.id} question={question} />
                    ))}
                </div>

                <div className="flex-shrink-0 w-full">
                    <PrompInput handleGenerateQuiz={handleGenerateQuiz} />
                </div>
            </div>
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