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

// Public assets that should bypass authentication
const publicPaths = [
  "/_next/",
  "/favicon.ico",
  "/images/",
  "/fonts/",
  "/api/auth/", // NextAuth API routes should be public
];

function isPublicPath(path: string): boolean {
  return publicPaths.some((prefix) => path.startsWith(prefix));
}

function requireBasicAuth(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip for public paths and localhost
  if (
    isPublicPath(path) ||
    request.headers.get("host")?.includes("localhost")
  ) {
    return null;
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Site - Development Only"',
      },
    });
  }

  const [scheme, encoded] = authHeader.split(" ");

  if (scheme !== "Basic" || !encoded) {
    return new Response("Invalid authentication scheme", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Site - Development Only"',
      },
    });
  }

  const buffer = Buffer.from(encoded, "base64");
  const [user, password] = buffer.toString("utf8").split(":");

  if (user !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASSWORD) {
    return new Response("Invalid credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Site - Development Only"',
      },
    });
  }

  return null; // Authentication successful
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Apply Basic Auth to all routes (except localhost and public paths)
  if (BASIC_AUTH_USER && BASIC_AUTH_PASSWORD) {
    const authResponse = requireBasicAuth(request);
    if (authResponse) {
      return authResponse;
    }
  }

  // Verify protected dashboard routes
  if (path.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Se não há token, redirecionar para login
    if (!token) {
      return NextResponse.redirect(
        new URL(
          `/admin/login?callbackUrl=${encodeURIComponent(path)}`,
          request.url
        )
      );
    }

    const userRole = token.role as string;
    console.log("User role:", userRole); // Debug log

    // Se tem uma role específica do newsletter manager, restringir acesso
    if (
      userRole === "newsletter_manager" &&
      !path.startsWith("/dashboard/newsletter")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Admin tem acesso a tudo
    if (userRole === "admin") {
      return NextResponse.next();
    }

    // Usuários regulares não têm acesso ao dashboard
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Rate limiting para POSTs em rotas de login
  if (request.method === "POST") {
    const loginRoutes = ["/api/auth/callback/credentials", "/api/auth/signin"];

    if (loginRoutes.some((route) => path.includes(route))) {
      const ip = extractIp(request);
      const userAgent = request.headers.get("user-agent") || "";

      const isAllowed = await checkLoginAllowed(ip);
      if (!isAllowed) {
        return NextResponse.json(
          {
            error: `Too many login attempts. Try again in ${BLOCK_DURATION_MINUTES} minutes.`,
          },
          { status: 429 }
        );
      }
    }
  }

  return NextResponse.next();
}

// Matcher para todas as rotas, exceto assets estáticos
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
