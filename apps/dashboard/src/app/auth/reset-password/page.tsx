"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomPasswordField } from "@/components/ui/custom-password-field";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (!tokenParam || !emailParam) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setToken(tokenParam);
    setEmail(emailParam);
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !email) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Password has been reset successfully! Redirecting to login..."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
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
            Reset Password
          </h1>
          <p className="text-gray-400">Enter your new password below.</p>
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

          {/* New Password Field */}
          <div className="mb-4">
            <CustomPasswordField
              id="password"
              label="New Password"
              password={formData.password}
              onChange={handleInputChange}
              isDisabled={isLoading}
              placeholder="Enter your new password"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <CustomPasswordField
              id="confirmPassword"
              label="Confirm New Password"
              password={formData.confirmPassword}
              onChange={handleInputChange}
              isDisabled={isLoading}
              placeholder="Confirm your new password"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !token || !email}
            className="w-full"
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>

          {/* Back to Login */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Remember your password?{" "}
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

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-gray-100">Loading...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
