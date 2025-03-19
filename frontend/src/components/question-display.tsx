import { useEffect, useState } from "react";
import { barriecieto } from "@/lib/fonts";
import { motion } from "framer-motion";
import { Question } from "@/app/dashboard/game/[code]/_stores/question-slice";

type GameState = "question" | "reveal-answer";

type QuestionDisplayProps = {
    currentQuestion: Question;
    gameState: GameState;
    correctAnswer: number | null;
}

export const QuestionDisplay = ({ currentQuestion, gameState, correctAnswer }: QuestionDisplayProps) => {
    const timeToAnswer = currentQuestion.timeToAnswer;
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
    }, [currentQuestion]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0.9, 1] }}
                className="rounded-full bg-black/20 aspect-square flex-shrink-0 text-center p-4 text-4xl md:text-6xl">
                <h2 className={`${barriecieto.className} w-full text-white`}>{timeLeft}</h2>
            </motion.div>
            <div className="w-full bg-white flex items-center justify-center p-2 md:p-5">
                <h1 className={`text-2xl md:text-5xl font-semibold`}>{currentQuestion.text}</h1>
            </div>
            <div className={`w-full p-2 md:p-12 md:pt-6 h-full gap-2 font-extrabold grid grid-cols-2`}>
                {currentQuestion.answers.map((answer, index) =>
                    <AnswerButton
                        index={index}
                        key={answer}
                        answer={answer}
                        correctAnswer={correctAnswer}
                        gameState={gameState}
                    />)}
            </div>
        </div>
    )
}

const AnswerButton = ({ answer, index, correctAnswer, gameState }: { answer: string, index: number, correctAnswer: number | null, gameState: GameState }) => {
    const colorClass = [
        "bg-blue-900",
        "bg-green-900",
        "bg-yellow-600",
        "bg-red-700"
    ][index];

    const variants = {
        correct: { scale: 1 },
        wrong: { scale: 0.99, opacity: 0.4 },
        default: { scale: 1, opacity: 1 }
    }

    const correctAndShow = gameState === "reveal-answer" && correctAnswer !== null && index === correctAnswer;
    const incorrectAndShow = gameState === "reveal-answer" && correctAnswer !== null && index !== correctAnswer;

    const wrongOrDefault = incorrectAndShow ? "wrong" : "default";
    const currentVariant = correctAndShow ? "correct" : wrongOrDefault;

    return (
        <motion.div
            className="origin-center w-full h-full"
            variants={variants}
            animate={currentVariant}
            initial={{ opacity: 1, scale: 1 }}
        >
            <button className={`${colorClass} text-white text-xl md:text-2xl w-full h-full p-2 rounded-lg`} key={answer}>
                {answer}
            </button>
        </motion.div>
    )
}