import { barriecieto } from "@/lib/fonts"
import { div } from "framer-motion/client"
import { Check, ThumbsUp, ThumbsUpIcon, XIcon } from "lucide-react"

type AnswerResult = "correct" | "incorrect" | "no-answer";

export const AnswerResults = ({ result }: { result: AnswerResult }) => {
    const colors = {
        "correct": "bg-green-400",
        "incorrect": "bg-red-400",
        "no-answer": "bg-white"
    }

    const bgColor = colors[result];

    return (
        <div className={`${bgColor} h-dvh w-full flex flex-col justify-center items-center`}>
            {result === "correct" && <AnsweredCorrectly />}
            {result === "incorrect" && <AnsweredInCorrectly />}
            {result === "no-answer" && <NoAnswer />}
        </div>
    )
}

const AnsweredCorrectly = () => {

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className={`text-6xl font-bold text-white ${barriecieto.className}`}>Correct!</h1>
            <Check size={130} color="white" strokeWidth={4} radius={0} />
        </div>
    )
}

const AnsweredInCorrectly = () => {

    return (
        <div className="flex flex-col items-center">
            <h1 className={`text-5xl font-bold text-white ${barriecieto.className}`}>Incorrect</h1>
            <XIcon size={130} color="white" strokeWidth={4} radius={0} />
        </div>
    )
}

const NoAnswer = () => {
    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className={`text-6xl font-bold ${barriecieto.className}`}>Too slow!</h1>
            <p className="opacity-50">You know you have to answer to win right?</p>
        </div>
    );
}