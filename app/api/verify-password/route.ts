import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Get the site password from environment variable
    const sitePassword = process.env.PUBLIC_PASSWORD;

    // If no password is set in environment, allow access
    if (!sitePassword) {
      return NextResponse.json({ success: true });
    }

    // Check if the provided password matches
    if (password === sitePassword) {
      return NextResponse.json({ success: true });
    }

    // Password doesn't match
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}
