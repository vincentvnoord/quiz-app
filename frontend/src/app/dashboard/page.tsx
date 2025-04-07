import { EllipsisVertical, FilePen, LogOut, PanelLeft, PlayIcon } from "lucide-react";
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
                <div className="w-full p-6 h-full flex flex-col gap-6 bg-white rounded-l-2xl">
                    <div className="flex gap-4 items-center">
                        <h1 className="text-3xl flex-grow font-bold text-shadow-sm">Example quiz</h1>

                        <button className="bg-primary min-w-32 text-white font-bold rounded-xl p-3 py-2 flex justify-center items-center">
                            <PlayIcon className="mr-2" size={26} fill="white" />
                            Play
                        </button>
                    </div>

                    <div className="flex flex-grow flex-col justify-evenly bg-background rounded-xl">
                        <p className="bg-white text-2xl text-center p-4">What is the capital of france?</p>

                        <div className="grid grid-cols-2 gap-4 p-4">
                            <div
                                className="bg-blue-600 text-white text-2xl font-semibold rounded-lg p-4 w-full h-full"
                            >
                                Paris
                            </div>

                            <div
                                className="bg-green-600 text-white text-2xl font-semibold rounded-lg p-4 w-full h-full"
                            >
                                Amsterdam
                            </div>

                            <div
                                className="bg-red-600 text-white text-2xl font-semibold rounded-lg p-4 w-full h-full"
                            >
                                London
                            </div>

                            <div
                                className="bg-yellow-600 text-white text-2xl font-semibold rounded-lg p-4 w-full h-full"
                            >
                                Mars
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex gap-4 items-center overflow-x-auto">
                        <div className="flex items-center rounded-xl w-24 h-24 p-6 justify-center">
                            <p className="text-xl font-semibold">1</p>
                        </div>

                        <div className="flex items-center rounded-xl w-24 h-24 p-6 justify-center">
                            <p className="text-xl font-semibold">2</p>
                        </div>

                        <div className="flex items-center bg-primary text-white rounded-xl w-24 h-24 p-6 justify-center">
                            <p className="text-xl font-semibold">3</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SidePanel = ({ quizzes }: { quizzes: QuizDisplay[] }) => {


    return (
        <div className="min-w-74 max-w-64 p-3 flex flex-col gap-4">
            <div className="flex gap-2 items-center">
                <PanelLeft className="" size={28} />
                <h1 className="text-2xl text-shadow-md font-bold w-full text-center">ACME</h1>
            </div>

            <button className="bg-primary text-white font-bold w-full rounded-xl p-3 py-2 flex justify-center items-center">
                New Quiz
            </button>

            <div className="flex flex-col p-1 gap-1 flex-grow overflow-y-scroll">
                {quizzes.map((quiz) => (
                    <ListedQuiz key={quiz.id} {...quiz} />
                ))}
            </div>

            <div className="flex gap-2 items-center p-4 pb-6 px-6">
                <LogOut size={24} />
                <p className="">Logout</p>
            </div>
        </div>
    )
}

const ListedQuiz = ({ id, title, questionCount }: QuizDisplay) => {

    return (
        <div className="hover:bg-white cursor-pointer w-full rounded-xl p-2 flex justify-between items-center">
            <div className="flex flex-col w-full truncate items-start">
                <p className="text-nowrap">{title} fdafdasfadsf asdfasd asdf</p>
                <p className="text-sm opacity-50">{questionCount} question{questionCount > 1 && "s"}</p>
            </div>

            <EllipsisVertical className="opacity-50" size={24} />
        </div>
    )
}