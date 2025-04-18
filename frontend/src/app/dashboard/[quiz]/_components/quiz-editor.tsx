"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuizStore } from "../../_stores/quiz-store";
import QuestionEditor from "./question-editor"
import { SearchX } from "lucide-react"
import { useEffect } from "react";
import { CreateGame } from "./create-game";

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

    document.title = `${quiz.title} | Quiz Editor`;

    return (
        <>
            <div className="flex gap-4 items-center">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl flex-grow font-bold text-shadow-sm">{quiz.title}</motion.h1>

                <CreateGame quizId={quizId} />
            </div>

            <QuestionEditor quizId={quizId} />
        </>
    )
}