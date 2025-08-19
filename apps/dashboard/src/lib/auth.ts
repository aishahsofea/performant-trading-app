import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
        // For now, mock a user with a hashed password
        // In production: const user = await db.select().from(users).where(eq(users.email, credentials.email))
        const mockUser = {
          id: "1",
          email: credentials.email,
          name: "Test User",
          // This would be the actual hashed password from database
          password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.VIIqkS.ee" // "password123" hashed
        };

        // Verify password against hash
        const isValidPassword = await verifyPassword(credentials.password, mockUser.password);
        
        if (!isValidPassword) {
          return null;
        }

        // Return user without password
        return {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        };
      },
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
