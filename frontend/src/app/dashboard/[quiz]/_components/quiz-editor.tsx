"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuizStore } from "../../_stores/quiz-store";
import QuestionEditor from "./question-editor"
import { PlayIcon, SearchX } from "lucide-react"
import { useEffect } from "react";

export const QuizEditor = () => {
    const { quizList } = useQuizStore();
    const params = useParams();
    const quizId = params["quiz"] as string;
    const quiz = quizList.find((quiz) => quiz.id == quizId);

    useEffect(() => {
        if (quiz === undefined) {
            document.title = `Not Found | Quiz Editor`;
            return;
        }

        document.title = `${quiz.title} | Quiz Editor`;
    }, [quiz])

    if (quiz === undefined) {
        return (
            <div className="w-full h-full flex gap-2 flex-col items-center justify-center">
                <SearchX className="" size={64} />
                <p className="text-2xl text-center">Quiz not found</p>
                <p className="text-secondary text-center">Please select a valid quiz from your library or create a new one.</p>
            </div>
        )
    }

    return (
        <>
            <div className="flex gap-4 items-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl flex-grow font-bold text-shadow-sm">{quiz.title}</motion.h1>

                <button className="bg-primary min-w-32 text-white font-bold rounded-xl p-3 py-2 flex justify-center items-center">
                    <PlayIcon className="mr-2" size={26} fill="white" />
                    Play
                </button>
            </div>

            <QuestionEditor quizId={quizId} />
        </>
    )
}