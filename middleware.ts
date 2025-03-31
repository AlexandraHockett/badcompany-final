// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Verificar se é uma rota protegida do dashboard
  if (path.startsWith("/dashboard")) {
    // Obter o token JWT do usuário
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Se não tiver token, redirecionar para login de admin
    if (!token) {
      return NextResponse.redirect(
        new URL(
          `/admin/login?callbackUrl=${encodeURIComponent(path)}`,
          request.url
        )
      );
    }

    // Verificar acesso baseado no papel do usuário
    const userRole = token.role as string;

    // Regras para newsletter_manager - acesso apenas às rotas de newsletter
    if (
      userRole === "newsletter_manager" &&
      !path.startsWith("/dashboard/newsletter")
    ) {
      // Redirecionar para a área permitida ou mostrar página de acesso negado
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Administradores têm acesso a todas as rotas do dashboard
    if (userRole === "admin") {
      return NextResponse.next();
    }

    // Usuários comuns não têm acesso ao dashboard
    if (userRole === "user") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Definir quais caminhos este middleware interceptará
export const config = {
  matcher: ["/dashboard/:path*"],
};
