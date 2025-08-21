import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import "@/types/auth"; // Import our custom type definitions
import { validateEmail, verifyPassword } from "@/lib/auth-utils";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Validate email format
        if (!validateEmail(credentials.email)) {
          return null;
        }

        // TODO: Replace with actual database lookup using Drizzle ORM
        // For now, accept any email/password combination for testing
        // In production: const user = await db.select().from(users).where(eq(users.email, credentials.email))
        
        // For testing: accept any password, but validate it has minimum length
        if (credentials.password.length < 6) {
          return null;
        }

        // Return user without password
        return {
          id: "test-user-" + credentials.email,
          email: credentials.email,
          name: "Test User",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id,
        };
      }
      return session;
    },
  },
};
