import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validar entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o email é o específico para newsletter
    if (email !== "geral@badcompany.pt") {
      return NextResponse.json(
        { error: "Acesso não autorizado" },
        { status: 403 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: "geral@badcompany.pt" },
    });

    // Verificar usuário
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar senha
    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    // Verificar se é um usuário de newsletter
    if (user.role !== "newsletter_manager") {
      return NextResponse.json(
        { error: "Acesso não autorizado para esta conta" },
        { status: 403 }
      );
    }

    // Sucesso
    return NextResponse.json({
      message: "Login bem-sucedido",
      role: user.role,
    });
  } catch (error) {
    console.error("Erro no login de newsletter:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
