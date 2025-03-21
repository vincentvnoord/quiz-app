import { useEffect, useState } from "react";
import { barriecieto } from "@/lib/fonts";
import { motion } from "framer-motion";
import { startTimer } from "@/lib/timer";
import { CorrectAnswerDto, QuestionStateDto } from "@/client/quiz-game/shared/stores/game-state";
import { AnswerResults } from "@/app/[game]/_components/answer-results";

type GameState = "question" | "reveal-answer";

type QuestionDisplayProps = {
    currentQuestion: QuestionStateDto;
    gameState: GameState;
    correctAnswer: CorrectAnswerDto | null;
    onAnswerPressed?: (index: number) => void;
}

export const QuestionDisplay = ({ currentQuestion, gameState, correctAnswer, onAnswerPressed }: QuestionDisplayProps) => {
    const timeToAnswer = currentQuestion.timeToAnswer;
    const [timeLeft, setTimeLeft] = useState(Math.ceil(timeToAnswer / 1000));

    useEffect(() => {
        if (gameState !== "question") return;

        startTimer(timeToAnswer, (currentTime: number) => setTimeLeft(currentTime));
    }, [currentQuestion, gameState, timeToAnswer]);
    
    if (correctAnswer?.playerAnswerResult)
        return <AnswerResults result={correctAnswer.playerAnswerResult} />

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 pt-6">
            <motion.div
                initial={gameState !== "question" && { scale: 0 }}
                animate={(gameState === "question" && timeLeft > 0) ? { scale: [0.9, 1] } : { scale: 0 }}
                className="rounded-full bg-black/20 aspect-square flex-shrink-0 text-center p-4 text-4xl md:text-6xl">
                <h2 className={`${barriecieto.className} w-full text-white`}>{timeLeft}</h2>
            </motion.div>
            {
                currentQuestion.hasAnswered ?
                    <div className={`h-full items-center gap-5 text-center w-full flex flex-col pt-32`}>
                        <h1 className="text-3xl font-bold">Did you get it right? :o</h1>
                        <p className="opacity-50">Waiting for players to answer...</p>
                    </div>
                    :
                    <>
                        <div className="w-full bg-white flex items-center justify-center p-2 md:p-5">
                            <h1 className={`text-2xl md:text-5xl font-semibold`}>{currentQuestion.text}</h1>
                        </div>
                        <div className={`w-full p-2 md:p-12 md:pt-6 h-full gap-2 font-extrabold grid grid-cols-2`}>
                            {currentQuestion.answers.map((answer, index) =>
                                <AnswerButton
                                    index={index}
                                    key={index}
                                    answer={answer}
                                    highlight={correctAnswer?.index}
                                    gameState={gameState}
                                    onAnswerPressed={onAnswerPressed}
                                />)}
                        </div>
                    </>
            }
        </div >
    )
}

type AnswerButtonProps = {
    answer: string;
    index: number;
    highlight?: number;
    gameState: GameState;
    onAnswerPressed?: (index: number) => void;
}

const AnswerButton = ({ answer, index, highlight, gameState, onAnswerPressed }: AnswerButtonProps) => {
    const colorClass = [
        "bg-blue-900",
        "bg-green-900",
        "bg-yellow-600",
        "bg-red-700"
    ][index];

    const variants = {
        default: { scale: 1, opacity: 1 },
        fade: { scale: 0.99, opacity: 0.4 },
    }

    const waitingForAnswer = highlight === undefined || highlight === null;
    const currentVariant = (highlight == index || waitingForAnswer) ? "default" : "fade";

    return (
        <motion.div
            className="origin-center w-full h-full"
            variants={variants}
            animate={currentVariant}
            initial={{ opacity: 1, scale: 1 }}
        >
            <button onClick={() => { if (onAnswerPressed) onAnswerPressed(index) }} className={`${colorClass} text-white text-xl md:text-2xl w-full h-full p-2 rounded-lg`} key={answer}>
                {answer}
            </button>
        </motion.div>
    )
}