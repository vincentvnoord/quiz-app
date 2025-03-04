import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserData } from "./_actions";

export default async function DashBoardPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken");
    if (!authToken) {
        redirect("/login");
    }

    const res = await getUserData(authToken.value);

    if (res.error) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <h1 className="text-foreground/50">{res.error}</h1>
            </div>
        )
    }

    const { id, email } = res;

    return (
        <div>
            <h1>Welcome back {email}, ur id is {id}</h1>
        </div>
    )
}