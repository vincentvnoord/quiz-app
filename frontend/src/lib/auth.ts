import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getUserTokenFromCookies = async () => {
    const authToken = (await cookies()).get("authToken");
    if (!authToken)
        redirect("/login");

    return authToken.value;
};