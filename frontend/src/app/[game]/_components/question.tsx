import { QuestionDisplay } from "@/components/question-display"
import { usePlayerGameStore } from "../_stores/game-store"

export const Question = () => {
    const { currentQuestion, gameState, correctAnswer } = usePlayerGameStore();

    return (
        <div className="h-dvh w-full flex flex-col pt-6">
            <QuestionDisplay currentQuestion={currentQuestion} gameState={gameState === "question" || gameState === "reveal-answer" ? gameState : "question"} correctAnswer={correctAnswer} />
        </div>
    )
}