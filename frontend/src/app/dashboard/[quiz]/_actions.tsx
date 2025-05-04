"use server";

import { getUserTokenFromCookies } from "../_actions";
import { Question } from "@/business/entities/quiz";

export async function getQuizQuestions(quizId: string): Promise<Question[] | null> {
    const authToken = await getUserTokenFromCookies();

    const res = await fetch(`${process.env.API_URL}/quiz/${quizId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    });

    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    const questions: Question[] = data.questions;
    return questions;
}
