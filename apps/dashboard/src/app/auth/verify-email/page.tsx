"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Spinner } from "@repo/ui/components";

const VerifyEmailForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setError(
        "Invalid verification link. Please request a new verification email."
      );
      return;
    }

    verifyEmail(token, email);
  }, [searchParams]);

  const verifyEmail = async (token: string, email: string) => {
    setIsVerifying(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Email verified successfully! You can now access all features."
        );
        setIsVerified(true);
      } else {
        setError(data.error || "Email verification failed");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold mb-2 text-gray-100">
            Email Verification
          </h1>
          <p className="text-gray-400">
            {isVerifying
              ? "Verifying your email address..."
              : "Email verification status"}
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-xl border border-gray-700 bg-gray-800">
          {/* Loading State */}
          {isVerifying && (
            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500 rounded-md">
              <div className="flex items-center">
                <Spinner size="sm" className="mr-2 border-blue-400" />
                <p className="text-sm text-blue-400 font-medium">
                  Verifying your email address...
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-500 rounded-md">
              <p className="text-sm text-green-400 font-medium">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-md">
              <p className="text-sm text-red-400 font-medium" role="alert">
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {isVerified ? (
              <Button
                type="submit"
                onClick={() => router.push("/")}
                className="w-full"
              >
                Continue to Dashboard
              </Button>
            ) : (
              !isVerifying && (
                <Button
                  type="submit"
                  onClick={() => router.push("/auth/login")}
                  className="w-full"
                >
                  Back to Login
                </Button>
              )
            )}

            {!isVerified && !isVerifying && (
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">
                  Didn't receive the email?
                </p>
                <button
                  onClick={() => router.push("/auth/resend-verification")}
                  className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Resend verification email
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-gray-100">Loading...</div>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
};

export default VerifyEmailPage;
