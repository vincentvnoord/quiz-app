import Link from "next/link";
import { EnterGamePinForm } from "./_components/enter-gamepin-form";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
      <header className="flex justify-end items-center w-full">
      etst
      </header>
      <main className="flex flex-col justify-center gap-4 row-start-2 items-center">
        <EnterGamePinForm />
        <p className="text-xl font-bold opacity-50">or</p>
        <Link className="bg-white p-3 rounded-lg" href="/dashboard">
          <p>Start your own!</p>
        </Link>
      </main>
    </div>
  );
}
