import { ChevronRight, EllipsisVertical, PanelLeft, UserIcon } from "lucide-react";
import { CreateQuiz } from "./_components/create-quiz";
import { CreateGame } from "./_components/create-game";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { QuizDisplay } from "@/business/entities/quiz";

type Question = {
    id: string;
    text: string;
}

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
    const quizzes = data.map((q: { id: string, title: string, questions: Question[] }) => {
        return {
            id: q.id,
            title: q.title,
            questionCount: q.questions.length,
        }
    })

    return (
        <div className="flex h-dvh relative">
            <SidePanel quizzes={quizzes} />
            <div className="w-full h-full py-4">
                <div className="w-full h-full bg-white rounded-l-2xl">

                </div>
            </div>
        </div>
    )
}

const SidePanel = ({ quizzes }: { quizzes: QuizDisplay[] }) => {


    return (
        <div className="min-w-64 max-w-64 p-3 flex flex-col gap-4">
            <div className="flex gap-2 items-center">
                <PanelLeft className="" size={28} />
                <h1 className="text-2xl font-bold w-full text-center">ACME</h1>
            </div>

            <button className="bg-primary text-white font-bold w-full rounded-xl p-3 py-2 flex justify-center items-center">
                New Quiz
            </button>

            <div className="flex flex-col gap-2">
                {quizzes.map((quiz) => (
                    <ListedQuiz key={quiz.id} {...quiz} />
                ))}
            </div>
        </div>
    )
}

const ListedQuiz = ({ id, title, questionCount }: QuizDisplay) => {

    return (
        <CreateGame quizId={id}>
            <div className="bg-white w-full rounded-xl p-2 flex justify-between items-center">
                <div className="flex flex-col w-full truncate items-start">
                    <p className="text-nowrap">{title} fdafdasfadsf asdfasd asdf</p>
                    <p className="text-sm opacity-50">{questionCount} question{questionCount > 1 && "s"}</p>
                </div>

                <EllipsisVertical className="opacity-50" size={24} />
            </div>
        </CreateGame>
    )
}