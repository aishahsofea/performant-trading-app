"use client";

import { useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole, getUserRole } from "@/lib/auth/authorization";

type AuthGuardProps = {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
};

/**
 * Component that guards its children based on authentication and role requirements
 */
export const AuthGuard = ({
  children,
  requiredRoles = ["user", "admin", "premium"],
  fallback = <div>Loading...</div>,
  redirectTo = "/auth/login",
}: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      const currentPath = window.location.pathname;
      router.push(
        `${redirectTo}?callbackUrl=${encodeURIComponent(currentPath)}`
      );
      return;
    }

    const userRole = getUserRole(session);
    if (!requiredRoles.includes(userRole)) {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, router, requiredRoles, redirectTo]);

  // Show loading state
  if (status === "loading") {
    return <>{fallback}</>;
  }

  // Check authentication
  if (!session) {
    return <>{fallback}</>;
  }

  // Check role permissions
  const userRole = getUserRole(session);
  if (!requiredRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Component that shows/hides content based on user permissions
 */
type ConditionalRenderProps = {
  children: ReactNode;
  requiredRoles: UserRole[];
  fallback?: ReactNode;
  requireAuth?: boolean;
};

export const ConditionalRender = ({
  children,
  requiredRoles,
  fallback = null,
  requireAuth = true,
}: ConditionalRenderProps) => {
  const { data: session, status } = useSession();

  // Still loading
  if (status === "loading") {
    return <>{fallback}</>;
  }

  // Check authentication requirement
  if (requireAuth && !session) {
    return <>{fallback}</>;
  }

  // Check role permissions
  if (session) {
    const userRole = getUserRole(session);
    if (!requiredRoles.includes(userRole)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

/**
 * Higher-order component for page-level route protection
 */
export const withPageAuth = <T extends object>(
  Component: React.ComponentType<T>,
  options: {
    requiredRoles?: UserRole[];
    redirectTo?: string;
    loading?: ReactNode;
  } = {}
) => {
  const {
    requiredRoles = ["user", "admin", "premium"],
    redirectTo = "/auth/login",
    loading = <div>Loading...</div>,
  } = options;

  const ProtectedComponent = (props: T) => (
    <AuthGuard
      requiredRoles={requiredRoles}
      redirectTo={redirectTo}
      fallback={loading}
    >
      <Component {...props} />
    </AuthGuard>
  );

  ProtectedComponent.displayName = `withPageAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return ProtectedComponent;
};
