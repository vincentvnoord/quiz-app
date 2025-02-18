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

type FormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const methods = useForm<FormData>({
        resolver: zodResolver(registerSchema),
    });

    const { handleSubmit, formState: { isSubmitting, errors, isSubmitSuccessful } } = methods;

    const onSubmit = async (data: FormData) => {
        console.log("Registering: " + JSON.stringify(data));
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Registered!");
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
            </form>
        </FormProvider >
    )
}
