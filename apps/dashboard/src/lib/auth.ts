import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import "@/types/auth"; // Import our custom type definitions
import { validateEmail } from "@/lib/auth-utils";
import { SESSION_CONFIG } from "./session-utils";
import { db, users, passwords } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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

        // Validate password length
        if (credentials.password.length < 6) {
          return null;
        }

        try {
          // Check if user exists in database
          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!existingUser) {
            console.log("Auth: User not found:", credentials.email);
            return null;
          }

          // Get the user's password hash
          const [userPassword] = await db
            .select()
            .from(passwords)
            .where(eq(passwords.userId, existingUser.id))
            .limit(1);

          if (!userPassword) {
            // User exists but has no password (OAuth-only user)
            console.log("Auth: User has no password (OAuth-only):", existingUser.email);
            return null;
          }

          // Verify the password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            userPassword.hashedPassword
          );

          if (!isPasswordValid) {
            console.log("Auth: Invalid password for user:", existingUser.email);
            return null;
          }

          console.log("Auth: Successfully authenticated user:", existingUser.email);
          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name || "User",
          };
        } catch (error) {
          console.error("Database error during authentication:", error);
          return null;
        }
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
    async signIn({ user, account }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
    },
    async signOut({ token }) {
      console.log(`User signed out: ${token?.email}`);
    },
    async session({ session }) {
      // Track session activity
      console.log(`Session accessed: ${session.user?.email}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};
