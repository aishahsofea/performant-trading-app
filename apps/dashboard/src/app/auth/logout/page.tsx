"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@repo/ui/components";

const LogoutPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // If user is not authenticated, redirect to home
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    // If user is authenticated, show logout confirmation
    if (status === "authenticated" && !isLoggingOut) {
      // Auto-logout after 5 seconds if no action taken
      const timer = setTimeout(() => {
        handleLogout();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status, isLoggingOut, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/", // Redirect to home page after logout
      });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-100 mb-4">
            Sign Out
          </h1>

          <div className="mb-6">
            <p className="text-gray-300 mb-2">
              Are you sure you want to sign out?
            </p>
            <p className="text-sm text-gray-400">
              You're currently signed in as{" "}
              <span className="font-medium">{session?.user?.email}</span>
            </p>
          </div>

          {!isLoggingOut ? (
            <>
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Sign Out
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-500">
                You will be automatically signed out in 5 seconds
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Spinner size="sm" className="border-purple-500" />
              <span className="text-gray-400">Signing out...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
