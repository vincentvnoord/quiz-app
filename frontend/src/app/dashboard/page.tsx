import { ChevronRight, UserIcon } from "lucide-react";
import { CreateQuiz } from "./_components/create-quiz";
import { CreateGame } from "./_components/create-game";

export default async function DashBoardPage() {

    return (
        <div className="flex flex-col h-dvh relative">
            <header className="bg-primary top-0 left-0 z-10 sticky text-white p-3 px-6 flex justify-between items-center rounded-b-[30px]">
                <h1 className="font-bold text-2xl">Your Quizzes</h1>
                <UserIcon size={28} />
            </header>

            <div className="flex flex-col items-center p-4 gap-2">
                <ListedQuiz />
                <CreateGame />
            </div>

            <CreateQuiz />
        </div>
    )
}

const ListedQuiz = () => {

    return (
        <div className="bg-white w-full rounded-xl p-3 flex justify-between items-center">
            <div className="flex flex-col">
                <p className="font-semibold">Quiz Title</p>
                <p className="text-sm opacity-50">10 questions</p>
            </div>

            <ChevronRight className="opacity-50" size={32} />
        </div>
    )
}