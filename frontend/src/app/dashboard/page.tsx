import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashBoardPage() {
    const authToken = (await cookies()).get("authToken");
    if (!authToken)
        redirect("/login");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/list`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken.value}`
        }
    });

    const data = await res.json();
    console.log(data);

    return (
        <div className="flex h-dvh relative">
        </div>
    )
}