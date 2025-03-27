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
      },
      async authorize(credentials) {
        // Validate input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Find user by email using explicit model access
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check user existence and password
        if (!user || !user.password) {
          throw new Error("User not found");
        }

        // Verify password
        const isPasswordCorrect = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
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
