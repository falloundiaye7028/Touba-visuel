import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/properties", "/buildings", "/owners", "/tenants", "/leads", "/visits", "/contracts", "/payments", "/arrears", "/expenses", "/commissions", "/owner-statements", "/maintenance", "/vendors", "/documents", "/import", "/reports", "/settings"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");

  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  if (!isProtected || demoMode) return response;

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  if (!token) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"] };
