import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserData } from "./_actions";
import { ChevronRight, PlusIcon, UserIcon } from "lucide-react";
import { Input } from "@/components/Input";
import { CreateQuiz } from "./_components/create-quiz";

export default async function DashBoardPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken");
    if (!authToken) {
        redirect("/login");
    }

    const res = await getUserData(authToken.value);

    if (res.error) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <h1 className="text-foreground/50">{res.error}</h1>
            </div>
        )
    }

    const { id, email } = res;

    return (
        <div className="flex flex-col h-dvh relative">
            <header className="bg-primary top-0 left-0 z-10 sticky text-white p-3 px-6 flex justify-between items-center rounded-b-[30px]">
                <h1 className="font-bold text-2xl">Your Quizzes</h1>
                <UserIcon size={28} />
            </header>

            <div className="flex flex-col p-4 gap-2">
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
                <ListedQuiz />
            </div>

            <div className="inset-0 z-20 fixed bg-black/50"></div>
            <div className="fixed flex flex-end w-full bottom-0 z-20 right-0 p-3 pb-6">
                <CreateQuiz />
            </div>
        </div>
    )
}

const ListedQuiz = () => {

    return (
        <div className="bg-white rounded-xl p-3 flex justify-between items-center">
            <div className="flex flex-col">
                <p className="font-semibold">Quiz Title</p>
                <p className="text-sm opacity-50">10 questions</p>
            </div>

            <ChevronRight className="opacity-50" size={32} />
        </div>
    )
}