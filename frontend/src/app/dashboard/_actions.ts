"use server";

import { UnAuthorizedError } from "@/business/entities/errors/common";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createGameController } from "@/controllers/game/create-game-controller";

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