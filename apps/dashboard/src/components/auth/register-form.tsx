"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  validateRegistrationForm,
  type RegistrationFormData,
} from "@/lib/auth-utils";
import { ContinueWithGoogle } from "./continue-with-google";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { CustomPasswordField } from "../ui/custom-password-field";

type RegisterFormProps = {
  callbackUrl?: string;
};

export const RegisterForm = ({ callbackUrl = "/" }: RegisterFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // Validate form
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Call the registration API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle registration errors
        if (response.status === 409) {
          setAuthError(
            "An account with this email already exists. Please sign in instead."
          );
        } else if (response.status === 400) {
          setAuthError(
            data.error || "Invalid registration data. Please check your inputs."
          );
        } else {
          setAuthError("Registration failed. Please try again.");
        }
        return;
      }

      // Registration successful, now sign in the user
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setAuthError(
          "Registration successful but login failed. Please try signing in manually."
        );
      } else if (signInResult?.ok) {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError(
        "An unexpected error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-w-md mx-auto" data-testid="register-form-container">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2 text-gray-100">
          Create Account
        </h1>
        <p className="text-gray-400">Start your trading journey</p>
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
            Or create account with email
          </span>
        </div>
      </div>

      {/* Registration Form */}
      <form
        onSubmit={handleRegistrationSubmit}
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

        {/* Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 text-gray-200"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400"
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400 font-medium" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-gray-200"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400"
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
        <div className="mb-4">
          <CustomPasswordField
            id="password"
            label="Password"
            password={formData.password}
            onChange={handleInputChange}
            isDisabled={isLoading}
            error={errors.password}
          />
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <CustomPasswordField
            id="confirmPassword"
            label="Confirm Password"
            password={formData.confirmPassword}
            onChange={handleInputChange}
            isDisabled={isLoading}
            error={errors.confirmPassword}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
