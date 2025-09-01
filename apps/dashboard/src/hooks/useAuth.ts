"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  UserRole,
  getUserRole,
  checkRoutePermission,
} from "@/lib/auth/authorization";

export type UseAuthReturn = {
  user: any;
  session: any;
  status: "loading" | "authenticated" | "unauthenticated";
  role: UserRole;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  isLoading: boolean;
};

/**
 * Client-side authentication hook with role-based permissions
 */
export const useAuth = (): UseAuthReturn => {
  const { data: session, status } = useSession();
  const role = session ? getUserRole(session) : "user";

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (status === "loading" || !session) return false;
    return requiredRoles.includes(role);
  };

  return {
    user: session?.user || null,
    session,
    status,
    role,
    hasPermission,
    isLoading: status === "loading",
  };
};

/**
 * Hook to require authentication and optionally specific roles
 */
export const useRequireAuth = (
  requiredRoles: UserRole[] = ["user", "admin", "premium"],
  redirectTo: string = "/auth/login"
) => {
  const { session, status, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      // Not authenticated
      router.push(`${redirectTo}?callbackUrl=${window.location.pathname}`);
      return;
    }

    if (!requiredRoles.includes(role)) {
      // Insufficient permissions
      router.push("/unauthorized");
      return;
    }
  }, [session, status, role, router, requiredRoles, redirectTo]);

  return {
    session,
    status,
    role,
    isLoading: status === "loading",
    isAuthorized: status === "authenticated" && requiredRoles.includes(role),
  };
};

/**
 * Hook for route-level permission checking
 */
export const useRouteAuth = (pathname?: string) => {
  const { session, status, role } = useAuth();
  const router = useRouter();
  const currentPath =
    pathname ||
    (typeof window !== "undefined" ? window.location.pathname : "/");

  const permission = checkRoutePermission(currentPath, role, !!session);

  useEffect(() => {
    if (status === "loading") return;

    if (!permission.allowed) {
      if (permission.reason === "Authentication required") {
        router.push(
          `/auth/login?callbackUrl=${encodeURIComponent(currentPath)}`
        );
      } else if (permission.reason === "Insufficient permissions") {
        router.push("/unauthorized");
      }
    }
  }, [permission, status, router, currentPath]);

  return {
    ...permission,
    isLoading: status === "loading",
    role,
    session,
  };
};
