import { getUserController } from "@/controllers/users/get-user-controller";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react"

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            {children}
        </>
    )
}