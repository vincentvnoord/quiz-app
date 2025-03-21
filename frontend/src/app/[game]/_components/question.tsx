import { QuestionDisplay } from "@/components/question-display"
import { usePlayerGameStore } from "../../../client/quiz-game/player/stores/player-game-store"

export const Question = () => {
    const { currentQuestion, gameState, correctAnswer } = usePlayerGameStore();

    if (!currentQuestion) return null;

    return (
        <div className="h-dvh w-full flex flex-col pt-6">
            <QuestionDisplay currentQuestion={currentQuestion} gameState={gameState === "question" || gameState === "reveal-answer" ? gameState : "question"} correctAnswer={correctAnswer} />
        </div>
    )
}