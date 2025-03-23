import { QuestionDisplay } from "@/components/question-display"
import { usePlayerGameStore } from "../../../client/quiz-game/player/stores/player-game-store"

export const Question = () => {
    const { state: { currentQuestion, gameState, correctAnswer }, gameManager } = usePlayerGameStore();

    if (!currentQuestion) return null;

    const onAnswerPressed = (index: number) => {
        if (gameManager == null) return;

        gameManager.answerQuestion(index);
    }

    return (
        <div className="h-dvh w-full flex flex-col">
            <QuestionDisplay
                currentQuestion={currentQuestion}
                gameState={gameState === "question" || gameState === "reveal-answer" ? gameState : "question"}
                correctAnswer={correctAnswer}
                onAnswerPressed={onAnswerPressed}
            />
        </div>
    )
}