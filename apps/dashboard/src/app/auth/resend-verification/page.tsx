"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@repo/ui/components";
import { useEmailValidation } from "@/hooks/useEmailValidation";

const ResendVerificationPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { validateAndSetError } = useEmailValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate email using unified validation
    if (!validateAndSetError(email, setError)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2 text-gray-100">
            Resend Verification Email
          </h1>
          <p className="text-gray-400">
            Enter your email address and we'll send you a new verification link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-lg shadow-xl border border-gray-700 bg-gray-800"
        >
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

          {/* Email Field */}
          <div className="mb-6">
            <Input
              type="email"
              id="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Send Verification Email"}
          </Button>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Already verified?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                Back to Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResendVerificationPage;
