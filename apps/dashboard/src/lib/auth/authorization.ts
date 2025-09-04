import { NextRequest } from "next/server";

// User roles - can be extended as needed
export type UserRole = "user" | "admin" | "premium";

// Route permissions
export interface RoutePermissions {
  path: string;
  allowedRoles: UserRole[];
  requireAuth: boolean;
}

// Default route permissions configuration
export const ROUTE_PERMISSIONS: RoutePermissions[] = [
  // Public routes
  { path: "/", allowedRoles: ["user", "admin", "premium"], requireAuth: false },
  {
    path: "/auth",
    allowedRoles: ["user", "admin", "premium"],
    requireAuth: false,
  },

  // Protected user routes
  {
    path: "/dashboard",
    allowedRoles: ["user", "admin", "premium"],
    requireAuth: true,
  },
  {
    path: "/profile",
    allowedRoles: ["user", "admin", "premium"],
    requireAuth: true,
  },
  {
    path: "/performance",
    allowedRoles: ["user", "admin", "premium"],
    requireAuth: true,
  },

  // Premium features
  {
    path: "/solar-system",
    allowedRoles: ["user", "premium", "admin"],
    requireAuth: true,
  },

  // Admin routes (for future use)
  { path: "/admin", allowedRoles: ["admin"], requireAuth: true },
];

/**
 * Get user role from session - defaults to 'user' for now
 * In the future, this would query the database for the user's actual role
 */
export const getUserRole = (session: any): UserRole => {
  // For now, all users are 'user' role
  // TODO: Implement role storage in database and retrieval logic
  if (session?.user?.email === "admin@example.com") {
    return "admin"; // Example admin user
  }
  return "user";
};

/**
 * Check if a user has permission to access a specific route
 */
export const checkRoutePermission = (
  pathname: string,
  userRole: UserRole,
  isAuthenticated: boolean
): { allowed: boolean; reason?: string } => {
  // Find matching route permission - sort by path length (longest first) to match most specific route
  const routePermission = ROUTE_PERMISSIONS.sort(
    (a, b) => b.path.length - a.path.length
  ).find((permission) => pathname.startsWith(permission.path));

  // If no specific permission found, default to requiring auth for non-public routes
  if (!routePermission) {
    const isPublicRoute =
      pathname.startsWith("/auth/") ||
      pathname === "/" ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/favicon");

    if (isPublicRoute) {
      return { allowed: true };
    }

    if (!isAuthenticated) {
      return { allowed: false, reason: "Authentication required" };
    }

    return { allowed: true };
  }

  // Check if authentication is required
  if (routePermission.requireAuth && !isAuthenticated) {
    return { allowed: false, reason: "Authentication required" };
  }

  // Check if user role is allowed
  if (isAuthenticated && !routePermission.allowedRoles.includes(userRole)) {
    return { allowed: false, reason: "Insufficient permissions" };
  }

  return { allowed: true };
};

/**
 * Middleware helper to check route permissions
 */
export const checkMiddlewareAuth = (req: NextRequest, token: any) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!token;
  const userRole = token ? getUserRole({ user: token }) : "user";

  return checkRoutePermission(pathname, userRole, isAuthenticated);
};

// API route protection wrapper moved to server.ts to avoid Edge Runtime issues
