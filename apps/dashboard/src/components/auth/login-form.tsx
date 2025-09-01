"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { validateLoginForm, type LoginFormData } from "@/lib/auth-utils";
import {
  ContinueWithGoogle,
  Button,
  PasswordInput,
  Input,
} from "@repo/ui/components";

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
          <span className="w-full border-t border-gray-500" />
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
          <Input
            type="email"
            id="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled={isLoading}
            error={errors.email}
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            error={errors.password}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="mb-6 text-right">
          <Button
            variant="link"
            size="link"
            onClick={() => router.push("/auth/forgot-password")}
            disabled={isLoading}
          >
            Forgot password?
          </Button>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?
            <Button
              variant="link"
              size="link"
              onClick={() => router.push("/auth/register")}
              disabled={isLoading}
            >
              Sign up
            </Button>
          </p>
        </div>
      </form>
    </div>
  );
};
