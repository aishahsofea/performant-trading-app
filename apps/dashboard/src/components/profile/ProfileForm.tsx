"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { validateEmail } from "@/lib/auth-utils";
import { CustomSelect } from "@/components/ui/CustomSelect";

type ProfileFormData = {
  name: string;
  email: string;
  bio: string;
  timezone: string;
};

type ProfileFormProps = {
  onSave?: (data: ProfileFormData) => Promise<void>;
};

export const ProfileForm = ({ onSave }: ProfileFormProps) => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    bio: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setSuccessMessage("");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      if (onSave) {
        await onSave(formData);
      } else {
        // TODO: Replace with actual API call
        console.log("Profile update:", formData);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      }
      setSuccessMessage("Profile updated successfully!");
    } catch {
      setErrors({ general: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="p-3 bg-green-900/20 border border-green-500 rounded-md">
          <p className="text-sm text-green-400 font-medium">{successMessage}</p>
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="p-3 bg-red-900/20 border border-red-500 rounded-md">
          <p className="text-sm text-red-400 font-medium">{errors.general}</p>
        </div>
      )}

      {/* Name Field */}
      <div>
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
          <p className="mt-1 text-sm text-red-400 font-medium">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-2 text-gray-200"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-400"
          placeholder="Enter your email address"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400 font-medium">
            {errors.email}
          </p>
        )}
      </div>

      {/* Bio Field */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium mb-2 text-gray-200"
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          className="w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-vertical placeholder-gray-400"
          placeholder="Tell us about yourself and your trading experience"
          disabled={isLoading}
        />
      </div>

      {/* Timezone Field */}
      <div>
        <label
          htmlFor="timezone"
          className="block text-sm font-medium mb-2 text-gray-200"
        >
          Timezone
        </label>
        <CustomSelect
          value={formData.timezone}
          onChange={(value) => setFormData((prev) => ({ ...prev, timezone: value }))}
          disabled={isLoading}
          options={[
            { value: "America/New_York", label: "Eastern Time (ET)" },
            { value: "America/Chicago", label: "Central Time (CT)" },
            { value: "America/Denver", label: "Mountain Time (MT)" },
            { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
            { value: "Europe/London", label: "London (GMT)" },
            { value: "Europe/Paris", label: "Central European Time (CET)" },
            { value: "Asia/Tokyo", label: "Tokyo (JST)" },
            { value: "Asia/Singapore", label: "Singapore (SGT)" },
            { value: "Australia/Sydney", label: "Sydney (AEDT)" },
          ]}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white px-6 py-2.5 rounded-md hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLoading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
};
