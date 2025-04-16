import { PlayIcon } from "lucide-react"
import QuestionEditor from "../_components/question-editor"

export default function QuizPage() {

    return (
        <div className="w-full p-6 h-full flex flex-col gap-6 bg-white rounded-l-2xl">
            <div className="flex gap-4 items-center">
                <h1 className="text-3xl flex-grow font-bold text-shadow-sm">Example quiz</h1>

                <button className="bg-primary min-w-32 text-white font-bold rounded-xl p-3 py-2 flex justify-center items-center">
                    <PlayIcon className="mr-2" size={26} fill="white" />
                    Play
                </button>
            </div>

            <QuestionEditor />
        </div>
    )
}