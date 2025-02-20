"use server";

import { InputParseError } from "@/business/entities/errors/common";
import { RegistrationError, RegistrationErrorType } from "@/business/entities/errors/RegistrationError";
import { registerUserController } from "@/controllers/users/register-controller";
import { FieldValues } from "react-hook-form";

type RegistrationResponse =
    | { success: true }
    | { success: false; errorMessage?: string; inputErrors?: { path: string; message: string }[] };

export const registerUser = async (formData: FieldValues): Promise<RegistrationResponse> => {
    try {
        await registerUserController(formData);
        return { success: true };
    } catch (e) {
        if (e instanceof InputParseError) {
            return { success: false, inputErrors: e.errors };
        } else if (e instanceof RegistrationError) {
            if (e.type == RegistrationErrorType.EMAIL_EXISTS) {
                return { success: false, errorMessage: "Email already exists, try logging in." }
            }

            return systemErrorResponse;
        }
        else {
            return systemErrorResponse;
        }
    }
}

const systemErrorResponse = {
    success: false,
    errorMessage: "Something went wrong, please try again later."
}