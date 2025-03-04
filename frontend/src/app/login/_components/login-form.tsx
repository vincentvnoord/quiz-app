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
import { login } from "../_actions";
import { Info } from "lucide-react";

type FormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [showError, setShowError] = React.useState<boolean>(false);

    const methods = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    });
    const { handleSubmit, formState: { isSubmitting } } = methods;

    const onSubmit = async (data: FormData) => {
        const res = await login(data);
        if (res.success) {
            window.location.href = "/dashboard";
            return;
        }

        if (res.errorMessage) {
            setSubmitError(res.errorMessage);
            setShowError(true);
        }
    }
    
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[360px] flex flex-col gap-2">
                <EmailInput />
                <PasswordInput />
                <motion.button
                    animate={isSubmitting ? { scale: 0.8 } : { scale: 1 }}
                    type="submit"
                    className={`${barriecieto.className} ${isSubmitting ? "bg-gray-400" : "bg-primary"} text-white w-full p-3 rounded-2xl text-4xl transition-colors duration-100 ease-in`}
                    disabled={isSubmitting}
                >
                    {
                        isSubmitting ?
                            "loading"
                            :
                            "LOG IN"
                    }
                </motion.button>
                <motion.div initial={{ opacity: 0, height: 0 }} animate={showError ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }} className="flex justify-center items-center text-destructive gap-2 overflow-hidden">
                    <Info className="flex-grow-0 flex-shrink-0" strokeWidth={2.3} size={28} />
                    {submitError && <p className="text-destructive text-sm">{submitError}</p>}
                </motion.div>
            </form>
        </FormProvider>
    )
};