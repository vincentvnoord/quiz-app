"use server";

import { getUserController } from "@/controllers/users/get-user-controller";
import { UnAuthorizedError } from "@/business/entities/errors/common";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createGameController } from "@/controllers/game/create-game-controller";

export async function getUserData(authToken: string) {
    try {
        const user = await getUserController(authToken);
        return { id: user.id, email: user.email };
    } catch (e) {
        if (e instanceof UnAuthorizedError) {
            console.error(e.message);
            redirect("/login");
        }

        console.error("Error getting user: ", e);
        return { error: "Something went wrong, please try again later." };
    }
}

export async function createGame() {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("authToken");
        if (!authToken) {
            redirect("/login");
        }

        const res = await createGameController(authToken.value);
        return res.code;
    } catch (e) {
        if (e instanceof UnAuthorizedError) {
            console.error(e.message);
            redirect("/login");
        }
    }
}