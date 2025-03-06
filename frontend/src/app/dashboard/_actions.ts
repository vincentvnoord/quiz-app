"use server";

import { getUserController } from "@/controllers/users/get-user-controller";
import { UnAuthorizedError } from "@/business/entities/errors/common";
import { redirect } from "next/navigation";

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