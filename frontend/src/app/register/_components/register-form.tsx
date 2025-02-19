"use client";

import { motion, Transition, useAnimation } from "framer-motion";
import { barriecieto } from "@/lib/fonts";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "@/controllers/users/register-controller";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { EmailInput } from "./email";
import { PasswordInput } from "./password";
import { PrivacyAgreement } from "./privacy";
import { CircleCheck, CircleCheckBig, Info } from "lucide-react";
import Link from "next/link";

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
                <form onSubmit={handleSubmit(onSubmit)} className={`w-full max-w-[360px] flex flex-col gap-3 ${success && "pointer-events-none"}`}>
                    <motion.div animate={isSubmitting ? { opacity: 0.5 } : { opacity: 1 }} className="flex flex-col gap-1">
                        <FloatingDissapearing dissapear={success}>
                            <EmailInput />
                        </FloatingDissapearing>
                        <FloatingDissapearing dissapear={success} delay={0.1}>
                            <PasswordInput />
                        </FloatingDissapearing>

                        <FloatingDissapearing dissapear={success} delay={0.2}>
                            <PrivacyAgreement />
                        </FloatingDissapearing>
                    </motion.div>
                    <FloatingDissapearing dissapear={success} delay={0.3}>
                        <motion.div
                            className="w-full"
                            animate={isSubmitting ? { scale: 0.9 } : { scale: 1 }}
                        >
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
                        </motion.div>
                    </FloatingDissapearing>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={showError ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }} className="flex justify-center items-center text-destructive gap-2 overflow-hidden">
                        <Info className="flex-grow-0 flex-shrink-0" strokeWidth={2.3} size={28} />
                        {submitError && <p className="text-destructive text-sm">{submitError}</p>}
                    </motion.div>
                </form>

                <div className={`w-full h-full flex justify-center items-center absolute top-0 left-0 ${success ? "" : "pointer-events-none"}`}>
                    <div className="flex flex-col gap-2 items-center p-3">
                        <motion.div transition={{ delay: 0.5 }} initial={{ scale: 0, rotate: 360 }} animate={success ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 360 }}>
                            <CircleCheckBig className="text-positive" size={100} />
                        </motion.div>
                        <motion.div transition={{ delay: 0.8 }} initial={{ opacity: 0, translateY: 20 }} animate={success ? { opacity: 1, translateY: 0 } : { opacity: 0, translateY: 20 }} className="flex flex-col gap-2 items-center">
                            <p className="text-xl text-center font-bold">You have successfully registered!</p>
                        </motion.div>
                        <motion.div transition={{ delay: 0.9 }} initial={{ opacity: 0, translateY: 20 }} animate={success ? { opacity: 1, translateY: 0 } : { opacity: 0, translateY: 20 }} className="flex flex-col gap-2 items-center">
                            <span className="text-base">
                                You can safely {" "}
                                <Link className="underline text-primary" href="/login">login to your account</Link>
                            </span>
                        </motion.div>
                    </div>
                </div>
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
    const control = useAnimation();

    useEffect(() => {
        const animate = async () => {
            if (dissapear) {
                await control.start({
                    y: [0, -50, 0],
                    opacity: [1, 1, 0],
                    transition: {
                        duration: 0.5,
                        ease: "circInOut",
                        delay: delay,
                    },
                });
            } else {
                control.start({
                    y: 0,
                    opacity: 1,
                    transition: {
                        delay,
                        duration: 0.5,
                    },
                });
            }
        }

        animate();
    }, [dissapear, control, delay]);

    return (
        <motion.div
            initial="visible"
            animate={control}
        >
            {children}
        </motion.div>
    );
};
