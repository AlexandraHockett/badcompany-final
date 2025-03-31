// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Criar uma instância estendida do Prisma Client
class ExtendedPrismaClient extends PrismaClient {
  constructor(options?) {
    super(options);
  }
}

// Adicionar métodos para os modelos personalizados
ExtendedPrismaClient.prototype.loginAttempt =
  ExtendedPrismaClient.prototype.loginAttempt ||
  new Proxy(
    {},
    {
      get(target, prop) {
        throw new Error(
          `Prisma Client extended method 'loginAttempt.${String(prop)}' is not implemented`
        );
      },
    }
  );

ExtendedPrismaClient.prototype.loginBlocklist =
  ExtendedPrismaClient.prototype.loginBlocklist ||
  new Proxy(
    {},
    {
      get(target, prop) {
        throw new Error(
          `Prisma Client extended method 'loginBlocklist.${String(prop)}' is not implemented`
        );
      },
    }
  );

// Singleton pattern com global type preservation
const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

// Configurações do Prisma
const prismaOptions = {
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
};

// Criar ou reutilizar a instância do Prisma Client
export const prisma =
  globalForPrisma.prisma || new ExtendedPrismaClient(prismaOptions);

// Em ambientes de não-produção, armazenar o cliente globalmente
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// Exportar todos os tipos do Prisma
export * from "@prisma/client";
