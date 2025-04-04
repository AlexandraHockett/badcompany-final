// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

// Ensure the roles are explicitly typed
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
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        // Find user by email
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

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user", // Ensure a role is always returned
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
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID and role to session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role || "user";
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
