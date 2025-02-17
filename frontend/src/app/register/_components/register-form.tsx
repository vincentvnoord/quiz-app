"use client";

import { barriecieto } from "@/lib/fonts";
import Link from "next/link";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "@/controllers/users/register-controller";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Eye, EyeClosed, EyeOffIcon, ShieldCheck, ShieldX } from "lucide-react";

type FormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const methods = useForm<FormData>({
        resolver: zodResolver(registerSchema),
    });

    const { handleSubmit } = methods;

    const onSubmit = (data: FormData) => {
        console.log("Registering: " + JSON.stringify(data));
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[360px] flex flex-col gap-3">
                <Input valid={false} error={false} label="Email" type="email" />
                <PasswordInput />
                <PrivacyAgreement />
                <button type="submit" className={`${barriecieto.className} text-white bg-primary p-3 mt-4 rounded-2xl text-4xl`} >
                    REGISTER
                </button>
            </form>
        </FormProvider>
    )
}


const PrivacyAgreement = () => {

    return (
        <div className="flex gap-2 items-center">
            <div className="bg-white flex rounded-lg w-10 h-10">
                <input className="hidden w-full h-full" type="checkbox" />
            </div>
            <label className="opacity-80">I have read and agree to the <Link className="underline text-primary" href={"/privacy"}>Privacy Policy</Link></label>
        </div>
    )
}

const PasswordInput = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const { register, formState: { errors } } = useFormContext();
    const error = errors.password;
    const errorMessage = error?.message;
    console.log(errorMessage);

    return (
        <div className="w-full flex flex-col">
            <Input className="z-50" valid={false} error={errorMessage !== undefined} {...register("password")} label="Password" type={showPassword ? "text" : "password"}>
                <div onClick={() => setShowPassword(!showPassword)} className="pr-3 opacity-50">
                    {
                        showPassword ?
                            <Eye className="" size={28} />
                            :
                            <EyeOffIcon className="" size={28} />
                    }
                </div>
            </Input>
            <p className="text-sm p-2 opacity-80">Minimum 12 characters</p>
        </div>
    )
}

const Input = React.forwardRef<HTMLInputElement, { label: string, error: boolean, valid: boolean } & React.ComponentProps<"input">>(
    ({ className, type, label, children, error, valid, ...props }, ref) => {

        return (
            <div className="flex z-20 flex-col w-full justify-center">
                <label className="pl-2 opacity-50 font-bold" htmlFor={props.name}>{label}</label>
                <div className={`bg-white flex rounded-lg w-full items-center ${!valid && !error ? "border-0" : "border-b-4"} border-destructive`}>
                    <input ref={ref} className="bg-transparent rounded-lg p-3 py-4 focus:outline-none w-full" type={type} {...props} />
                    {children}
                </div>
            </div>
        )
    }
);
Input.displayName = "Input";

const PasswordCorrectness = ({ isCorrect }: { isCorrect: boolean }) => {
    return (
        <div className="flex items-center">
            {isCorrect ? <ShieldCheck className="text-green-500 w-10 h-10 pr-2" /> : <ShieldX className="text-destructive w-10 h-10 pr-2" />}
        </div>
    )
}