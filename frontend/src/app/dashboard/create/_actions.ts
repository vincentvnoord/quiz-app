"use server";

import { Quiz } from "@/business/entities/quiz";

export const generateQuiz = async (prompt: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: prompt })
    });

    if (!res.ok) {
        throw new Error("Failed to generate quiz");
    }

    const data = await res.json();
    console.log(data);
    const quiz: Quiz = data;
    return quiz;
}