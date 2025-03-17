import { Ban, Undo2 } from "lucide-react"
import Link from "next/link"


export const GameNotFound = () => {

    return (
        <div className="h-full w-full gap-4 flex flex-col justify-center items-center">
            <div className="flex flex-col gap-2 items-center text-destructive p-6 rounded-2xl">
                <Ban size={100} />
                <h1 className="font-bold text-black text-2xl">Game not found</h1>
            </div>

            <Link href={"/dashboard"} className="flex gap-2 bg-white p-2 rounded-lg">
                <Undo2 className="opacity-50" size={24} />
                <p className="text-black/50 text-xl">
                    Back to dashboard
                </p>
            </Link>
        </div>
    )
}