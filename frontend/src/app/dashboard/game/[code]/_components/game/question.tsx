import { useEffect, useState } from "react";
import useGameStore from "../../_stores/game-store"
import { barriecieto } from "@/lib/fonts";
import { motion } from "framer-motion";

export const Question = () => {
    const { currentQuestion } = useGameStore();
    const { timeToAnswer } = currentQuestion;
    const [timeLeft, setTimeLeft] = useState(timeToAnswer);

    useEffect(() => {
        setTimeLeft(timeToAnswer);

        let remainingTime = timeToAnswer;

        const interval = setInterval(() => {
            remainingTime--;

            if (remainingTime <= 0) {
                clearInterval(interval);
            }

            setTimeLeft(remainingTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentQuestion])

    return (
        <div className="h-dvh flex flex-col overflow-hidden items-center justify-center gap-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0.9, 1] }}
                className="rounded-full bg-black/20 aspect-square text-center p-4 text-6xl">
                <h2 className={`${barriecieto.className} text-white`}>{timeLeft}</h2>
            </motion.div>
            <div className="w-full bg-white flex items-center justify-center p-2 md:p-5">
                <h1 className={`text-2xl md:text-5xl font-semibold`}>{currentQuestion.text}</h1>
            </div>
            <div className={`font-extrabold text-white text-4xl grid grid-cols-2 gap-6`}>
                {currentQuestion.answers.map((answer, index) => <AnswerButton key={answer} answer={answer} />)}
            </div>
        </div>
    )
}

const AnswerButton = ({ answer }: { answer: string }) => {
    return (
        <button className="bg-primary p-2 rounded-lg" key={answer}>
            {answer}
        </button>
    )
}