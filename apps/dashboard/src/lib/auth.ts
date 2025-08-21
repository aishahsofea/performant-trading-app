import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import "@/types/auth"; // Import our custom type definitions
import { validateEmail, verifyPassword } from "@/lib/auth-utils";
import { SESSION_CONFIG } from "./session-utils";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
    signOut: "/auth/logout",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_CONFIG.MAX_AGE, // 24 hours - total session lifetime
    updateAge: SESSION_CONFIG.REFRESH_THRESHOLD, // 1 hour - session refreshes if older than this
  },
  jwt: {
    maxAge: SESSION_CONFIG.MAX_AGE, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // Add timestamp for session tracking
        token.iat = Math.floor(Date.now() / 1000);
        token.lastActivity = Math.floor(Date.now() / 1000);
      }

      // Update last activity on token refresh
      if (token) {
        token.lastActivity = Math.floor(Date.now() / 1000);
      }

      // Add provider information for OAuth users
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
        };

        // Add session metadata
        session.lastActivity = token.lastActivity as number;
        session.provider = token.provider as string;
        session.iat = token.iat as number; // Session creation timestamp
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
    async session({ session, token }) {
      // Track session activity
      console.log(`Session accessed: ${session.user?.email}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};
