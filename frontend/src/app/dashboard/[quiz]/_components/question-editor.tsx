"use client";

import { useEffect, useState } from "react";
import { getQuizQuestions } from "../_actions";
import { Answer, Question } from "@/business/entities/quiz";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function QuestionEditor({ quizId }: { quizId: string }) {
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [loading, setLoading] = useState(true);
    const selectedQuestionParam = useSearchParams().get("question");
    const selectedQuestionIndex = parseInt(selectedQuestionParam ?? "0");
    const selectedQuestion = questions?.[selectedQuestionIndex];

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const res = await getQuizQuestions(quizId);
            if (res === null) {
                console.error("Error fetching questions");
                return;
            }

            setQuestions(res);

            setLoading(false);
        }

        fetchQuestions();
    }, [quizId]);

    return (
        <div className="flex w-full h-full flex-grow gap-4">
            <div className="flex flex-col min-h-0 truncate text-ellipsis w-48 h-full lg:w-96 gap-2 overflow-y-auto">
                {
                    loading && (
                        <>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    key={i}
                                    className="animate-pulse bg-gray-100 rounded-md h-10 w-full"
                                />
                            ))}
                        </>
                    )
                }
                {
                    (!loading && questions) && questions?.map((question, index) => (
                        <ListedQuestion key={question.id} question={question} index={index} selected={index === selectedQuestionIndex} />
                    ))
                }
                {
                    (questions === null && !loading) && (
                        <p className="text-center text-secondary">No questions found</p>
                    )
                }
            </div>

            <div className="h-full w-[1px] bg-foreground/50"></div>

            <div className="flex flex-grow flex-col gap-8 items-center">
                <p className="bg-white text-2xl text-center">{selectedQuestion?.text}</p>
                <div className="grid grid-cols-2 gap-2 w-full">
                    {selectedQuestion?.answers.map((answer) => (
                        <ListedAnswer key={answer.id} answer={answer} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const ListedAnswer = ({ answer }: { answer: Answer }) => {
    return (
        <div className="flex items-center border-[1px] border-foreground/50 rounded-lg p-2">
            <p className="text-lg flex items-center gap-2 text-clip overflow-hidden truncate">
                {answer.text}
            </p>
        </div>
    )
}

const ListedQuestion = ({ index, question, selected = false }: { index: number, question: Question, selected?: boolean }) => {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        router.push(`?question=${index}`, { scroll: false });
    }

    return (
        <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={hovered ? undefined : { delay: index * 0.02 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
            className={`${selected && "bg-gray-100"} transition-colors duration-100 ease-in cursor-pointer flex items-center rounded-lg p-2`}>
            <motion.p
                initial={{ x: 0 }}
                animate={hovered ? { x: 10 } : { x: 0 }}
                className="flex items-center gap-2 text-clip overflow-hidden">
                <span className="max-w-12 text-sm">{index + 1}.</span>
                <span className="truncate">{question.text}</span>
            </motion.p>
        </motion.button>
    )
}