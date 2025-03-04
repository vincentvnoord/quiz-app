"use server";

import { UnAuthorizedError } from "@/business/entities/errors/common";
import { loginController } from "@/controllers/users/login-controller";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const login = async (fieldValues: FieldValues) => {
    try {
        const cookie = await loginController(fieldValues);
        if (!cookie) {
            return { success: false, errorMessage: "Invalid credentials" };
        }

        (await cookies()).set("authToken", cookie, {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
        })

        return { success: true };
    } catch (e) {
        if (e instanceof UnAuthorizedError) {
            return { success: false, errorMessage: "Incorrect email or password. Please try again." };
        } else {
            return { success: false, errorMessage: "Something went wrong. Please try again later." };
        }
    }
}