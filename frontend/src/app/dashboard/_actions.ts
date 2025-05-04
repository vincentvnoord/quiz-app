"use server";

import { UnAuthorizedError } from "@/business/entities/errors/common";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createGameController } from "@/controllers/game/create-game-controller";
import { Quiz, QuizDisplay } from "@/business/entities/quiz";

export async function getUserTokenFromCookies() {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get("authToken");

    if (!authToken) {
        redirect("/login");
    }

    return authToken.value;
}

export async function createGame(terminateExisting: boolean, quizId: string) {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("authToken");
        if (!authToken) {
            redirect("/login");
        }

        const code = await createGameController(authToken.value, quizId, terminateExisting);
        return code;
    } catch (e) {
        if (e instanceof UnAuthorizedError) {
            console.error(e.message);
            redirect("/login");
        }
    }
}

export async function getQuizList() {
    const authToken = await getUserTokenFromCookies();

    const res = await fetch(`${process.env.API_URL}/quiz/list`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        }
    });

    if (res.status === 401) {
        redirect("/login");
    }

    if (res.status === 403) {
        redirect("/login");
    }

    if (res.status !== 200) {
        console.error("Error fetching quiz list:", res.status);
        console.error("Response:", res);
        return { success: false, data: null };
    }

    const data = await res.json();
    const quizList: Quiz[] = data.map((quiz: { id: string, title: string, questions: string[] }) => {
        return {
            id: quiz.id,
            state: "loaded",
            title: quiz.title,
            questions: quiz.questions,
        };
    });

    return {
        success: true, data: quizList,
    };
}