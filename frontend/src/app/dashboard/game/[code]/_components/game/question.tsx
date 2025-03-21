import useHostStore from "@/client/quiz-game/host/stores/host-store";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { QuestionDisplay } from "@/components/question-display";

export const Question = () => {
    const { currentQuestion, gameState, gameManager, correctAnswer } = useHostStore();

    const nextQuestion = () => {
        console.log("Next question");
        gameManager?.continue();
        console.log(gameManager);
    }

    if (!currentQuestion) return null;

    return (
        <div className="h-dvh flex flex-col overflow-hidden items-center justify-center">
            <div className="flex p-4 justify-end items-center w-full">
                <motion.div
                    initial={{ y: -200 }}
                    animate={gameState === "reveal-answer" ? { y: [-200, 10, 0] } : { y: -200 }}
                    transition={{ duration: 0.6, ease: "circInOut" }}
                    className="flex">
                    <button className="bg-white h-fit flex items-center gap-2 text-xl md:text-2xl p-3 rounded-lg font-semibold" onClick={nextQuestion}>
                        Continue
                        <ArrowRight className="w-12 h-10" />
                    </button>
                </motion.div>
            </div>
            <QuestionDisplay currentQuestion={currentQuestion} gameState={gameState === "question" || gameState === "reveal-answer" ? gameState : "question"} correctAnswer={correctAnswer} />
        </div>
    )
}