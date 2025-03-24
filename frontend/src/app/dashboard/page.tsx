import { ChevronRight, UserIcon } from "lucide-react";
import { CreateQuiz } from "./_components/create-quiz";
import { CreateGame } from "./_components/create-game";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { QuizDisplay } from "@/business/entities/quiz";

export default async function DashBoardPage() {
    const authToken = (await cookies()).get("authToken");
    if (!authToken)
        redirect("/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/list`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken.value}`
        }
    });

    const data = await res.json();
    const quizzes = data.map((q: any) => {
        return {
            id: q.id,
            title: q.title,
            questionCount: q.questions.length,
        }
    })

    return (
        <div className="flex flex-col h-dvh relative">
            <header className="bg-primary top-0 left-0 z-10 sticky text-white p-3 px-6 flex justify-between items-center rounded-b-[30px]">
                <h1 className="font-bold text-2xl">Your Quizzes</h1>
                <UserIcon size={28} />
            </header>

            <div className="flex flex-col items-center p-4 gap-2">
                {quizzes.map((q: QuizDisplay) => <ListedQuiz key={q.id} {...q} />)}
            </div>

            <CreateQuiz />
        </div>
    )
}

const ListedQuiz = ({ id, title, questionCount }: QuizDisplay) => {

    return (
        <CreateGame quizId={id}>
            <div className="bg-white w-full rounded-xl p-3 flex justify-between items-center">
                <div className="flex flex-col items-start">
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm opacity-50">{questionCount} question{questionCount > 1 && "s"}</p>
                </div>

                <ChevronRight className="opacity-50" size={32} />
            </div>
        </CreateGame>
    )
}