"use client";

import { PanelLeft, LogOut, EllipsisVertical } from "lucide-react"
import { QuizDisplay } from "@/business/entities/quiz";
import { useQuizStore } from "../_stores/quiz-store";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getQuizList } from "../_actions";

export const QuizList = () => {
    const { quizList, setQuizList } = useQuizStore();

    useEffect(() => {
        const fetchQuizzes = async () => {
            const res = await getQuizList();
            console.log(res);
            if (res.success === false) {
                return;
            }

            if (res.data === null)
                return;

            console.log(res.data);
            setQuizList(res.data);
        };

        fetchQuizzes().catch((error) => {
            console.error("Error fetching quizzes:", error);
        });
    }, [setQuizList]);

    return (
        <div className="h-full w-full absolute inset-0 md:relative md:inset-auto md:w-fit z-20">
            <div className="h-full min-w-74 bg-background sm:max-w-64 p-3 flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                    <PanelLeft className="" size={28} />
                    <h1 className="text-2xl text-shadow-md font-bold w-full text-center">ACME</h1>
                </div>

                <Link href={"/dashboard"} className="bg-primary text-white font-bold w-full rounded-xl p-3 py-2 flex justify-center items-center">
                    New Quiz
                </Link>

                <div className="flex flex-col p-1 gap-1 flex-grow overflow-y-scroll overflow-x-hidden">
                    {quizList.map((quiz, index) => (
                        <ListedQuiz key={quiz.id} {...quiz} index={index} />
                    ))}
                </div>

                <div className="flex gap-2 items-center p-4 pb-6 px-6">
                    <LogOut size={24} />
                    <p className="">Logout</p>
                </div>
            </div>
        </div>
    )
}

const ListedQuiz = ({ id, title, questionCount, index }: QuizDisplay & { index: number }) => {
    const [hovered, setHovered] = useState(false);
    const params = useParams();
    const quizId = params["quiz"] as string;
    const isSelected = quizId == id;

    const handleActionsClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <Link href={`/dashboard/${id}`} className="w-full">
            <motion.div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
            >
                <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`${isSelected ? "bg-white" : "hover:bg-white/50"} transition-colors duration-100 ease-in-out cursor-pointer rounded-xl p-2 flex justify-between items-center`}>
                    <div className="flex flex-col min-w-0 flex-grow items-start">
                        <p className="text-sm truncate w-full">{title}</p>
                        <p className="text-xs opacity-50">{questionCount} question{questionCount > 1 && "s"}</p>
                    </div>

                    <motion.div
                        onClick={handleActionsClick}
                        initial={{ opacity: 0, x: 10, rotate: 90 }}
                        animate={hovered ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: 10, rotate: 90 }}
                        className="flex items-center hover:bg-foreground/10 p-1 rounded-full transition-colors duration-100 ease-in-out">
                        <EllipsisVertical className="opacity-50 flex-shrink-0" size={20} />
                    </motion.div>
                </motion.div>
            </motion.div>
        </Link>
    )
}