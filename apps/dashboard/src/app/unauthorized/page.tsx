"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/lib/auth/authorization";

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = session ? getUserRole(session) : "user";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          
          <h1 className="text-2xl font-bold text-red-400 mb-2">
            Access Denied
          </h1>
          
          <p className="text-gray-300 mb-4">
            You don't have permission to access this page.
          </p>
          
          <div className="text-sm text-gray-400 mb-6">
            Current role: <span className="font-medium text-gray-300">{userRole}</span>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Go Back
            </button>
            
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Go to Dashboard
            </button>

            {userRole === "user" && (
              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500 rounded-md">
                <p className="text-blue-300 text-sm">
                  Need premium features? 
                  <button 
                    onClick={() => router.push("/upgrade")}
                    className="ml-1 text-blue-200 underline hover:text-blue-100"
                  >
                    Upgrade your account
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}