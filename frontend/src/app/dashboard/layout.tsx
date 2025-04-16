import React from "react"
import { QuizList } from "./_components/quiz-list";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="flex h-dvh relative">
            <QuizList />
            <div className="w-full h-full py-4">
                <div className="w-full p-6 h-full flex flex-col gap-6 bg-white rounded-l-2xl">
                    {children}
                </div>
            </div>
        </div>
    )
}