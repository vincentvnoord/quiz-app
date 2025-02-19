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
import SuccessMessage from "./success-message";

type FormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const methods = useForm<FormData>({
        resolver: zodResolver(registerSchema),
    });

    const { handleSubmit, formState: { isSubmitting } } = methods;
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [showError, setShowError] = React.useState<boolean>(false);

    const [success, setSuccess] = React.useState<boolean>(false);

    const onSubmit = async (data: FormData) => {
        try {
            setShowError(false);
            console.log("Registering: " + JSON.stringify(data));
            // Call server action to process register
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setSuccess(true);
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
            <div className="w-full flex items-center flex-col">
                <motion.div animate={isSubmitting ? { opacity: 0.8 } : { opacity: 1 }} className={`w-full flex flex-col items-center gap-4 ${success && "pointer-events-none"}`}>
                    <form onSubmit={handleSubmit(onSubmit)} className={`w-full max-w-[360px] flex flex-col gap-3`}>
                        <div className="flex flex-col gap-1">
                            <FloatingDissapearing dissapear={success}>
                                <EmailInput />
                            </FloatingDissapearing>
                            <FloatingDissapearing dissapear={success} delay={0.1}>
                                <PasswordInput />
                            </FloatingDissapearing>

                            <FloatingDissapearing dissapear={success} delay={0.2}>
                                <PrivacyAgreement />
                            </FloatingDissapearing>
                        </div>
                        <FloatingDissapearing dissapear={success} delay={0.3}>
                            <button
                                type="submit"
                                className={`${barriecieto.className} ${isSubmitting ? "bg-gray-400" : "bg-primary"} text-white w-full p-3 mt-4 rounded-2xl text-4xl transition-colors duration-100 ease-in`}
                                disabled={isSubmitting}
                            >
                                {
                                    isSubmitting ?
                                        "loading"
                                        :
                                        "REGISTER"
                                }
                            </button>
                        </FloatingDissapearing>
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={showError ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }} className="flex justify-center items-center text-destructive gap-2 overflow-hidden">
                            <Info className="flex-grow-0 flex-shrink-0" strokeWidth={2.3} size={28} />
                            {submitError && <p className="text-destructive text-sm">{submitError}</p>}
                        </motion.div>
                    </form>

                    <FloatingDissapearing dissapear={success} delay={0.4}>
                        <p className="text-center text-sm">
                            Already have an account? {" "}
                            <a href="/login" className="underline text-primary">Login</a>
                        </p>
                    </FloatingDissapearing>
                </motion.div>

                <SuccessMessage success={success} />
            </div>
        </FormProvider >
    )
}

const FloatingDissapearing = ({
    children,
    dissapear,
    delay = 0,
}: {
    children?: React.ReactNode;
    dissapear: boolean;
    delay?: number;
}) => {
    const variants = {
        hide: {
            y: [0, -50, 0],
            opacity: [1, 1, 0],
            transition: {
                duration: 0.5,
                ease: "circInOut",
                delay: delay,
            },
        },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "circInOut",
                delay: delay,
            },
        },
    };

    return (
        <motion.div
            initial="show"
            animate={dissapear ? "hide" : "show"}
            variants={variants}
        >
            {children}
        </motion.div>
    );
};
