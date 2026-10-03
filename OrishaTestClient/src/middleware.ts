import { NextRequest, NextResponse } from "next/server";


export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ─────────────────────────────────────────────
    //  Pages (navigation front)
    // ─────────────────────────────────────────────
    const token = req.cookies.get("auth_token")?.value;
    const tokenExpiry = req.cookies.get("token_expiry")?.value;
    const isLoginPage = pathname === "/login";

    if (token && tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        ["auth_token", "token_expiry", "tenant_id"].forEach((key) => {
            response.cookies.delete(key);
        });
        return response;
    }

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token && isLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};