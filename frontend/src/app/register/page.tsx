import { barriecieto } from "@/lib/fonts";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Register | Quiz App",
    description: "Register an account to start creating quizzes of your own!",
};

export default function RegisterPage() {

    return (
        <div className="w-full h-dvh">
            <main className="w-full h-full flex flex-col items-center justify-center p-3">
                <h1 className="text-5xl pb-8 font-semibold justify-self-start">Register an account</h1>
                <form className="w-full max-w-[360px] flex flex-col gap-3">
                    <Input label="Email" type="email" />
                    <Input label="Password" type="password" />
                    <Input label="Repeat Password" type="password" />
                    <PrivacyAgreement />
                    <button className={`${barriecieto.className} text-white bg-primary p-3 rounded-2xl text-4xl`} >
                        REGISTER
                    </button>
                </form>
            </main>
        </div>
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
            <div className="bg-white flex rounded-lg w-full">
                <input className="bg-transparent rounded-lg p-3 py-4 focus:outline-none w-full" type={type} />
            </div>
        </div>
    )
}