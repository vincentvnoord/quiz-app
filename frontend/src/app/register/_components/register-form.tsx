"use client";

import { motion } from "framer-motion";
import { barriecieto } from "@/lib/fonts";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "@/controllers/users/register-controller";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { EmailInput } from "./email";
import { PasswordInput } from "./password";
import { PrivacyAgreement } from "./privacy";
import { Info } from "lucide-react";

type FormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const methods = useForm<FormData>({
        resolver: zodResolver(registerSchema),
    });

    const { handleSubmit, formState: { isSubmitting, errors, isSubmitSuccessful } } = methods;
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [showError, setShowError] = React.useState<boolean>(false);

    const onSubmit = async (data: FormData) => {
        try {
            setShowError(false);
            console.log("Registering: " + JSON.stringify(data));
            // Call server action to process register
            await new Promise((resolve) => setTimeout(resolve, 2000));
            throw new Error("Something went wrong, please try again later.");
        } catch (e) {
            if (e instanceof Error) {
                setSubmitError(e.message);
            } else {
                setSubmitError("An unknown error occurred.");
            }
            setShowError(true);
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[360px] flex flex-col gap-3">
                <motion.div animate={isSubmitting ? { opacity: 0.5 } : { opacity: 1 }} className="flex flex-col gap-1">
                    <EmailInput />
                    <PasswordInput />
                    <PrivacyAgreement />
                </motion.div>
                <motion.div
                    className="w-full"
                    animate={isSubmitting ? { scale: 0.9 } : { scale: 1 }}
                >
                    <button
                        type="submit"
                        className={`${barriecieto.className} text-white w-full bg-primary p-3 mt-4 rounded-2xl text-4xl`}
                        disabled={isSubmitting}
                    >
                        {
                            isSubmitting ?
                                "loading"
                                :
                                "REGISTER"
                        }
                    </button>
                </motion.div>
                <motion.div initial={{ opacity: 0, height: 0 }} animate={showError ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }} className="flex justify-center items-center text-destructive gap-2 overflow-hidden">
                    <Info className="flex-grow-0 flex-shrink-0" strokeWidth={2.3} size={28} />
                    {submitError && <p className="text-destructive text-sm">{submitError}</p>}
                </motion.div>
            </form>
        </FormProvider >
    )
}
