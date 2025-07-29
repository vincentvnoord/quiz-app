"use server";

import { Quiz } from "@/business/entities/quiz";
import { getUserTokenFromCookies } from "@/lib/auth";

export const generateQuiz = async (prompt: string) => {
    try {
        const authToken = await getUserTokenFromCookies();
        const res = await fetch(`${process.env.API_URL}/quiz/generate`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: prompt }),
            credentials: "include"
        });

        if (!res.ok) {
            // Better error handling!!
            return { error: "Failed to generate quiz: " + res.statusText };
        }

        const data = await res.json();
        const quiz: Quiz = data;
        return { quiz };
    } catch (error) {
        console.error("Error generating quiz: ", error);
        return { error: "Failed to generate quiz" };
    };
}
