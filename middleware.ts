import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkLoginAllowed, logLoginAttempt } from "@/utils/security";

const BLOCK_DURATION_MINUTES = 15;

// Basic Auth credentials from environment variables
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

function extractIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xRealIp = request.headers.get("x-real-ip");

  const ip = xForwardedFor || xRealIp || "127.0.0.1";
  return ip.split(",")[0].trim();
}

// Function to check Basic Auth
function requireBasicAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Authentication required" },
      {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
      }
    );
  }

  const [scheme, encoded] = authHeader.split(" ");

  if (scheme !== "Basic" || !encoded) {
    return NextResponse.json(
      { error: "Invalid authentication scheme" },
      {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
      }
    );
  }

  const buffer = Buffer.from(encoded, "base64");
  const [user, password] = buffer.toString("utf8").split(":");

  if (user !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASSWORD) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
      }
    );
  }

  return null; // Authentication successful
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check Basic Auth FIRST for ALL routes
  const authResponse = requireBasicAuth(request);
  if (authResponse) {
    return authResponse;
  }

  // Extract IP and user agent for logging
  const ip = extractIp(request);
  const userAgent = request.headers.get("user-agent") || "";

  // Rate limiting for login routes (only if Basic Auth passed)
  const loginRoutes = [
    "/login",
    "/admin/login",
    "/newsletter-login",
    "/api/auth/signin",
  ];

  if (loginRoutes.some((route) => path.includes(route))) {
    const isAllowed = await checkLoginAllowed(ip);

    if (!isAllowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Try again in ${BLOCK_DURATION_MINUTES} minutes.`,
        },
        { status: 429 }
      );
    }

    // Log the attempt with placeholder values
    await logLoginAttempt("unknown", false, ip, userAgent);
  }

  // Verify protected dashboard routes (only if Basic Auth passed)
  if (path.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(
        new URL(
          `/admin/login?callbackUrl=${encodeURIComponent(path)}`,
          request.url
        )
      );
    }

    const userRole = token.role as string;

    if (
      userRole === "newsletter_manager" &&
      !path.startsWith("/dashboard/newsletter")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (userRole === "admin") {
      return NextResponse.next();
    }

    if (userRole === "user") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Match ALL routes
export const config = {
  matcher: ["/((?!_next|_static|_vercel|favicon.ico).*)"],
};
