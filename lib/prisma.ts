// lib/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";

// Create a fully typed Prisma client that preserves all model types
class ExtendedPrismaClient extends PrismaClient {
  // Explicitly declare all model properties to ensure type safety
  constructor(options?: Prisma.PrismaClientOptions) {
    super(options);
  }
}

// Singleton pattern with global type preservation
const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

// Create or reuse the Prisma client instance
export const prisma =
  globalForPrisma.prisma ||
  new ExtendedPrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// In non-production environments, store the client globally
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// Type helpers for easy import of generated types
export * from "@prisma/client";
