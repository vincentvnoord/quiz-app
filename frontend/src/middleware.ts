import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const authHeader = req.cookies.get("authToken");

    if (!authHeader) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/dashboard/:path*",
};
