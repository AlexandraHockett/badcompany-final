// import { NextResponse, NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;

//   // Skip Basic Auth for static assets
//   if (
//     path.startsWith("/_next") ||
//     path.startsWith("/favicon.ico") ||
//     path.startsWith("/public/")
//   ) {
//     return NextResponse.next();
//   }

//   // Check for Basic Auth credentials
//   const authHeader = req.headers.get("authorization");

//   if (authHeader) {
//     const authValue = authHeader.split(" ")[1];
//     const [user, pwd] = atob(authValue).split(":");

//     // Check against environment variables
//     if (
//       user === process.env.BASIC_AUTH_USER &&
//       pwd === process.env.BASIC_AUTH_PASSWORD
//     ) {
//       return NextResponse.next();
//     }
//   }

//   // No valid auth credentials, prompt for login
//   const response = new NextResponse("Authentication required", {
//     status: 401,
//     headers: {
//       "WWW-Authenticate": 'Basic realm="Protected Site"',
//     },
//   });

//   return response;
// }

// export const config = {
//   matcher: ["/((?!api/auth).*)"],
// };

// middleware.ts;
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip Basic Auth for static assets
  if (
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/public/")
  ) {
    return NextResponse.next();
  }

  // First check for Basic Auth for site protection
  if (!process.env.BASIC_AUTH_USER || !process.env.BASIC_AUTH_PASSWORD) {
    // If Basic Auth is not set up, skip this check
    console.warn("Basic Auth credentials not set in environment");
  } else {
    const authHeader = request.headers.get("authorization");
    const basicAuth = await checkBasicAuth(authHeader);
    if (!basicAuth) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Protected Site"',
        },
      });
    }
  }

  // Admin route protection for dashboard
  if (path.startsWith("/dashboard")) {
    const token = await getToken({ req: request });

    if (!token) {
      // Redirect to admin login if not logged in
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (token.role !== "admin") {
      // Redirect to unauthorized page if not an admin
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Checkout page protection
  if (path.startsWith("/loja/checkout")) {
    const token = await getToken({ req: request });

    if (!token) {
      // Redirect to login if not logged in
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

async function checkBasicAuth(authHeader: string | null): Promise<boolean> {
  if (!authHeader) {
    return false;
  }

  const authValue = authHeader.split(" ")[1];
  const [user, pwd] = atob(authValue).split(":");

  return (
    user === process.env.BASIC_AUTH_USER &&
    pwd === process.env.BASIC_AUTH_PASSWORD
  );
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|images|favicon.ico).*)",
    "/dashboard/:path*",
    "/loja/checkout/:path*",
  ],
};
