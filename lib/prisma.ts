import { PrismaClient } from "@prisma/client";

// Evitar múltiplas instâncias do Prisma Client em desenvolvimento
// devido ao hot-reloading do Next.js

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Configurações otimizadas para o cliente
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["query", "error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
