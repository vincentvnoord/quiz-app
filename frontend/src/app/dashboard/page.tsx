import CreateQuiz from "./_components/create-quiz"

export default async function DashBoardPage() {

    return (
        <div className="flex flex-col h-dvh relative items-center justify-center gap-8">
            <CreateQuiz />
        </div>
    )
}