import { Metadata } from "next";
import { PlayerGame } from "./_components/game";

export const metadata: Metadata = {
    title: "Quiz Game",
    description: "Join a quiz and test your knowledge",
};

export default function GamePage() {
    return (
        <div className="h-dvh w-full overflow-hidden flex">
            <PlayerGame />
        </div>
    )
}