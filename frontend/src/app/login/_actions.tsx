"use server";

import { UnAuthorizedError } from "@/business/entities/errors/common";
import { loginController } from "@/controllers/users/login-controller";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { FieldValues } from "react-hook-form";

const login = async (fieldValues: FieldValues) => {
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
        
        return { success: true, message: "Authenticated" };
    } catch (e) {
        if (e instanceof UnAuthorizedError) {
            return { success: false, errorMessage: "Invalid credentials" };
        }
    }
}