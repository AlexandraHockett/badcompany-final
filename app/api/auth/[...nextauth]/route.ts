// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

// Type augmentation for NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        isAdmin: { label: "Is Admin", type: "boolean" },
        isNewsletterOnly: { label: "Is Newsletter Only", type: "boolean" },
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        // Find user by email using explicit model access
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check user existence and password
        if (!user || !user.password) {
          throw new Error("Utilizador não encontrado");
        }

        // Verify password
        const isPasswordCorrect = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Credenciais inválidas");
        }

        // Check if login is for admin area and user has admin role
        if (
          credentials.isAdmin === "true" &&
          user.role !== "admin" &&
          user.role !== "newsletter_manager"
        ) {
          throw new Error(
            "Acesso negado: permissões de administrador ou gerenciador de newsletter necessárias"
          );
        }

        // Verificar se é um login para a área de newsletter específica
        if (
          credentials.isNewsletterOnly === "true" &&
          user.role !== "newsletter_manager" &&
          user.role !== "admin"
        ) {
          throw new Error(
            "Acesso negado: permissões de gerenciador de newsletter necessárias"
          );
        }

        // Return user object for session
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  // Authentication flow configuration
  pages: {
    signIn: "/login",
    error: "/login", // Custom error page
  },

  // Session and token management
  session: {
    strategy: "jwt",
  },

  // Callbacks for customizing token and session
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID and role to token on first login
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID and role to session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  // Security
  secret: process.env.NEXTAUTH_SECRET,
};

// Create the handler with the configured options
const handler = NextAuth(authOptions);

// Export handler for GET and POST methods
export { handler as GET, handler as POST };
