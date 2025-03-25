import { PrismaClient } from "@prisma/client";

// Evitar múltiplas instâncias do Prisma Client em desenvolvimento
// devido ao hot-reloading do Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Configurações otimizadas para o cliente
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Nota: não usamos a propriedade connection diretamente
  }).$extends({
    // Podemos usar métodos mais avançados aqui se necessário
    model: {
      $allModels: {
        async findUniqueWithRetry(args: any, maxRetries = 3) {
          let retries = 0;
          while (true) {
            try {
              return await (this as any).findUnique(args);
            } catch (error) {
              retries++;
              if (retries >= maxRetries) throw error;
              console.log(`Retry attempt ${retries}...`);
              await new Promise((resolve) =>
                setTimeout(resolve, 1000 * retries)
              );
            }
          }
        },
      },
    },
  });
};

const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
