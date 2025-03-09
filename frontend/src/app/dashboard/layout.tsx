import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react"
import { getUserData } from "./_actions";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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

    return (
        <>
            {children}
        </>
    )
}