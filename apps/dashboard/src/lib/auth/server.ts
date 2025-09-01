import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";
import { UserRole, getUserRole } from "./authorization";

/**
 * Server-side authorization check for API routes and pages
 * This file can import NextAuth since it's only used in API routes, not middleware
 */
export const requireAuth = async (
  allowedRoles: UserRole[] = ["user", "admin", "premium"]
) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }

  const userRole = getUserRole(session);

  if (!allowedRoles.includes(userRole)) {
    throw new Error("Insufficient permissions");
  }

  return {
    user: session.user,
    role: userRole,
    session: session,
  };
};

/**
 * API route protection wrapper
 */
export const withApiAuth = (
  handler: Function,
  options: { allowedRoles?: UserRole[] } = {}
) => {
  return async function (req: NextRequest, ...args: any[]) {
    try {
      const { allowedRoles = ["user", "admin", "premium"] } = options;
      const auth = await requireAuth(allowedRoles);

      // Add auth context to the request
      (req as any).auth = auth;

      return handler(req, ...args);
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Unauthorized" },
        { status: 401 }
      );
    }
  };
};