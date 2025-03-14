import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");

  const authUser = process.env.BASIC_AUTH_USER;
  const authPassword = process.env.BASIC_AUTH_PASSWORD;

  if (!authUser || !authPassword) {
    throw new Error(
      "Missing BASIC_AUTH_USER or BASIC_AUTH_PASSWORD in environment variables"
    );
  }

  if (basicAuth) {
    const auth = basicAuth.split(" ")[1];
    const [user, password] = Buffer.from(auth, "base64").toString().split(":");

    if (user === authUser && password === authPassword) {
      return NextResponse.next();
    }
  }

  return new Response("Autenticação necessária", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected Area"',
    },
  });
}
