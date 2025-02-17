"use client";

import { barriecieto } from "@/lib/fonts";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerSchema } from "@/controllers/users/register-controller";

type FormSchema = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const { handleSubmit } = useForm<FormSchema>();

    const onSubmit = (data: FormSchema) => {
        console.log("Registering: " + JSON.stringify(data));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[360px] flex flex-col gap-3">
            <Input label="Email" type="email" />
            <Input label="Password" type="password" />
            <Input label="Repeat Password" type="password" />
            <PrivacyAgreement />
            <button type="submit" className={`${barriecieto.className} text-white bg-primary p-3 mt-4 rounded-2xl text-4xl`} >
                REGISTER
            </button>
        </form>
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


const Input = ({ label, type }: { label: string, type: string }) => {
    return (
        <div className="flex flex-col w-full">
            <label className="pl-2 opacity-50 font-bold" htmlFor="username">{label}</label>
            <div className="bg-white flex rounded-lg w-full border-b-4 border-destructive">
                <input className="bg-transparent rounded-lg p-3 py-4 focus:outline-none w-full" type={type} />
            </div>
        </div>
    )
}