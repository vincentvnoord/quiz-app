"use client";

import { EmailInput } from "@/app/register/_components/email";
import { PasswordInput } from "@/app/register/_components/password";
import { loginSchema } from "@/controllers/users/login-controller";
import { barriecieto } from "@/lib/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";

type FormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [showError, setShowError] = React.useState<boolean>(false);
    const [success, setSuccess] = React.useState<boolean>(false);

    const methods = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    });
    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = async (data: FormData) => {

        setSuccess(true);
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[360px] flex flex-col gap-2">
                <EmailInput />
                <PasswordInput />
                <motion.button
                    animate={isSubmitting ? { scale: 0.8 } : { scale: 1 }}
                    type="submit"
                    className={`${barriecieto.className} ${isSubmitting ? "bg-gray-400" : "bg-primary"} text-white w-full p-3 mt-4 rounded-2xl text-4xl transition-colors duration-100 ease-in`}
                    disabled={isSubmitting}
                >
                    {
                        isSubmitting ?
                            "loading"
                            :
                            "LOG IN"
                    }
                </motion.button>
            </form>
        </FormProvider>
    )
};