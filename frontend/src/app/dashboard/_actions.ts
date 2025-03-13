"use server";

import { UnAuthorizedError } from "@/business/entities/errors/common";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createGameController } from "@/controllers/game/create-game-controller";

export async function getUserTokenFromCookies() {
    const cookieStore = cookies();
    const authToken = (await cookieStore).get("authToken");

    console.log(authToken);

    if (!authToken) {
        redirect("/login");
    }

    return authToken.value;
}

export async function createGame(terminateExisting: boolean) {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("authToken");
        if (!authToken) {
            redirect("/login");
        }

        // Replace "1" with the actual quiz ID in future for custom quizzes
        const code = await createGameController(authToken.value, "1", terminateExisting);
        return code;
    } catch (e) {
        if (e instanceof UnAuthorizedError) {
            console.error(e.message);
            redirect("/login");
        }
    }
}