import { Metadata } from "next";
import { RegisterForm } from "./_components/register-form";

export const metadata: Metadata = {
    title: "Register | Quiz App",
    description: "Register an account to start creating quizzes of your own!",
};

export default function RegisterPage() {

    return (
        <div className="w-full h-dvh">
            <main className="w-full h-full flex flex-col items-center pt-12 p-3 justify-center md:pt-3">
                <RegisterForm />
            </main>
        </div>
    )
}