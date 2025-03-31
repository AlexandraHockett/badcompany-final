// utils/security.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 15;

export async function logLoginAttempt(
  email: string,
  success: boolean,
  ip: string,
  userAgent?: string
) {
  try {
    await prisma.$transaction([
      prisma.loginAttempt.create({
        data: {
          email,
          success,
          ip,
          userAgent: userAgent || null,
        },
      }),
    ]);

    // Se não for sucesso, gerenciar bloqueios
    if (!success) {
      await manageLoginBlocklist(ip);
    }
  } catch (error) {
    console.error("Erro ao registrar tentativa de login:", error);
  }
}

export async function manageLoginBlocklist(ip: string) {
  try {
    const existingBlock = await prisma.loginBlocklist.findUnique({
      where: { ip },
    });

    if (existingBlock) {
      // Verificar se o bloqueio expirou
      const minutesSinceLastAttempt =
        (new Date().getTime() - existingBlock.lastAttempt.getTime()) /
        (1000 * 60);

      if (minutesSinceLastAttempt >= BLOCK_DURATION_MINUTES) {
        // Remover bloqueio antigo
        await prisma.loginBlocklist.delete({
          where: { ip },
        });
      } else {
        // Atualizar tentativas
        await prisma.loginBlocklist.update({
          where: { ip },
          data: {
            attempts: existingBlock.attempts + 1,
            lastAttempt: new Date(),
          },
        });
      }
    } else {
      // Criar novo registro de bloqueio
      await prisma.loginBlocklist.create({
        data: {
          ip,
          attempts: 1,
          lastAttempt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("Erro ao gerenciar blocklist de login:", error);
  }
}

export async function checkLoginAllowed(ip: string): Promise<boolean> {
  try {
    const blocklistEntry = await prisma.loginBlocklist.findUnique({
      where: { ip },
    });

    if (!blocklistEntry) return true;

    const minutesSinceLastAttempt =
      (new Date().getTime() - blocklistEntry.lastAttempt.getTime()) /
      (1000 * 60);

    // Se excedeu o número máximo de tentativas e não passou o tempo de bloqueio
    if (
      blocklistEntry.attempts >= MAX_LOGIN_ATTEMPTS &&
      minutesSinceLastAttempt < BLOCK_DURATION_MINUTES
    ) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erro ao verificar login:", error);
    return true; // Em caso de erro, permitir login
  }
}

// Função utilitária para extrair IP seguramente
export function extractIp(req: NextRequest): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  const xRealIp = req.headers.get("x-real-ip");

  // Usar x-forwarded-for ou x-real-ip, com fallback para 127.0.0.1
  const ip = xForwardedFor || xRealIp || "127.0.0.1";

  // Se x-forwarded-for contém múltiplos IPs, pegar o primeiro
  return ip.split(",")[0].trim();
}
