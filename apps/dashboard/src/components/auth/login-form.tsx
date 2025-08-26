"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { validateLoginForm, type LoginFormData } from "@/lib/auth-utils";
import { ContinueWithGoogle } from "./continue-with-google";
import { Button } from "@/components/ui/button";
import { CustomPasswordField } from "../ui/custom-password-field";

type LoginFormProps = {
  callbackUrl?: string;
};

export const LoginForm = ({ callbackUrl = "/" }: LoginFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-w-md mx-auto" data-testid="login-form-container">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2 text-white">Sign In</h1>
        <p className="text-gray-400">Access your trading dashboard</p>
      </div>

      {/* OAuth Section */}
      <div className="mb-6">
        <ContinueWithGoogle onClick={handleGoogleSignIn} />
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-900 px-2 text-gray-500">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Credentials Form */}
      <form
        onSubmit={handleCredentialsSubmit}
        role="form"
        className="p-6 rounded-lg shadow-xl border border-gray-700 bg-gray-800"
      >
        {/* Auth Error */}
        {authError && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-md">
            <p className="text-sm text-red-400 font-medium" role="alert">
              {authError}
            </p>
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-white bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors placeholder-gray-400"
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400 font-medium" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <CustomPasswordField
            id="password"
            label="Password"
            password={formData.password}
            onChange={handleInputChange}
            isDisabled={isLoading}
            error={errors.password}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="mb-6 text-right">
          <a
            href="/auth/forgot-password"
            className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
