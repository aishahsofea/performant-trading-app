"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  component?: string;
  isRequired: boolean;
  estimatedTime?: number;
};

export type OnboardingState = {
  currentStepId: string | null;
  completedSteps: string[];
  skippedSteps: string[];
  completedTours: string[];
  progress: number;
  isComplete: boolean;
  showTooltips: boolean;
  tourSpeed: "slow" | "normal" | "fast";
};

const defaultSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Trading Dashboard",
    description: "Get started with your personal trading dashboard",
    isRequired: true,
    estimatedTime: 2,
  },
  {
    id: "profile-setup",
    title: "Complete Your Profile",
    description: "Add your trading preferences and personal information",
    isRequired: true,
    estimatedTime: 5,
  },
  {
    id: "dashboard-tour",
    title: "Dashboard Tour",
    description: "Learn how to navigate and customize your dashboard",
    isRequired: false,
    estimatedTime: 8,
  },
  {
    id: "features-overview",
    title: "Features Overview",
    description: "Discover powerful features for performance monitoring",
    isRequired: false,
    estimatedTime: 10,
  },
  {
    id: "completion",
    title: "Setup Complete",
    description: "You're all set! Start monitoring your performance",
    isRequired: true,
    estimatedTime: 1,
  },
];

export const useOnboarding = () => {
  const { status } = useSession();
  const [onboardingState, setOnboardingState] =
    useState<OnboardingState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch onboarding progress
  const fetchProgress = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/onboarding/progress");
      if (!response.ok) throw new Error("Failed to fetch onboarding progress");

      const data = await response.json();
      setOnboardingState({
        currentStepId: data.currentStepId,
        completedSteps: Array.isArray(data.completedSteps)
          ? data.completedSteps
          : [],
        skippedSteps: Array.isArray(data.skippedSteps) ? data.skippedSteps : [],
        completedTours: Array.isArray(data.completedTours)
          ? data.completedTours
          : [],
        progress: data.progress || 0,
        isComplete: data.isComplete || false,
        showTooltips: data.showTooltips !== false,
        tourSpeed: data.tourSpeed || "normal",
      });
    } catch (err) {
      console.error("Error fetching onboarding progress:", err);
      setError("Failed to load onboarding progress");
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  // Initialize onboarding data
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setIsLoading(false);
      return;
    }

    fetchProgress();
  }, [status, fetchProgress]);

  // Complete a step
  const completeStep = useCallback(
    async (stepId: string) => {
      try {
        const response = await fetch("/api/onboarding/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stepId, action: "complete" }),
        });

        if (!response.ok) throw new Error("Failed to complete step");

        const result = await response.json();

        // Update local state
        if (onboardingState) {
          setOnboardingState((prev) =>
            prev
              ? {
                  ...prev,
                  completedSteps: [
                    ...prev.completedSteps.filter((s) => s !== stepId),
                    stepId,
                  ],
                  skippedSteps: prev.skippedSteps.filter((s) => s !== stepId),
                  progress: result.progress,
                  isComplete: result.isComplete,
                }
              : null
          );
        }

        return true;
      } catch (err) {
        console.error("Error completing step:", err);
        setError("Failed to complete step");
        return false;
      }
    },
    [onboardingState]
  );

  // Skip a step
  const skipStep = useCallback(
    async (stepId: string) => {
      try {
        const response = await fetch("/api/onboarding/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stepId, action: "skip" }),
        });

        if (!response.ok) throw new Error("Failed to skip step");

        // Update local state
        if (onboardingState) {
          setOnboardingState((prev) =>
            prev
              ? {
                  ...prev,
                  skippedSteps: [
                    ...prev.skippedSteps.filter((s) => s !== stepId),
                    stepId,
                  ],
                  completedSteps: prev.completedSteps.filter(
                    (s) => s !== stepId
                  ),
                }
              : null
          );
        }

        return true;
      } catch (err) {
        console.error("Error skipping step:", err);
        setError("Failed to skip step");
        return false;
      }
    },
    [onboardingState]
  );

  // Move to next step
  const nextStep = useCallback(() => {
    if (!onboardingState) return null;

    const currentIndex = defaultSteps.findIndex(
      (step) => step.id === onboardingState.currentStepId
    );
    const nextIndex = currentIndex + 1;

    if (nextIndex < defaultSteps.length) {
      return defaultSteps[nextIndex];
    }

    return null;
  }, [onboardingState]);

  // Move to previous step
  const prevStep = useCallback(() => {
    if (!onboardingState) return null;

    const currentIndex = defaultSteps.findIndex(
      (step) => step.id === onboardingState.currentStepId
    );
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      return defaultSteps[prevIndex];
    }

    return null;
  }, [onboardingState]);

  // Set current step
  const setCurrentStep = useCallback(
    async (stepId: string) => {
      try {
        const response = await fetch("/api/onboarding/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentStepId: stepId }),
        });

        if (!response.ok) throw new Error("Failed to update current step");

        // Update local state
        if (onboardingState) {
          setOnboardingState((prev) =>
            prev ? { ...prev, currentStepId: stepId } : null
          );
        }

        return true;
      } catch (err) {
        console.error("Error setting current step:", err);
        setError("Failed to update current step");
        return false;
      }
    },
    [onboardingState]
  );

  // Update preferences
  const updatePreferences = useCallback(
    async (preferences: Partial<OnboardingState>) => {
      try {
        const response = await fetch("/api/onboarding/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
        });

        if (!response.ok) throw new Error("Failed to update preferences");

        // Update local state
        if (onboardingState) {
          setOnboardingState((prev) =>
            prev ? { ...prev, ...preferences } : null
          );
        }

        return true;
      } catch (err) {
        console.error("Error updating preferences:", err);
        setError("Failed to update preferences");
        return false;
      }
    },
    [onboardingState]
  );

  // Get current step details
  const getCurrentStep = useCallback(() => {
    if (!onboardingState?.currentStepId) return null;
    return (
      defaultSteps.find((step) => step.id === onboardingState.currentStepId) ||
      null
    );
  }, [onboardingState]);

  // Check if onboarding should be shown
  const shouldShowOnboarding = useCallback(() => {
    return (
      status === "authenticated" &&
      (!onboardingState ||
        (!onboardingState.isComplete && onboardingState.progress < 100))
    );
  }, [status, onboardingState]);

  return {
    // Data
    onboardingState,
    steps: defaultSteps,
    currentStep: getCurrentStep(),
    isLoading,
    error,

    // Computed
    shouldShowOnboarding: shouldShowOnboarding(),
    nextStep: nextStep(),
    prevStep: prevStep(),

    // Actions
    completeStep,
    skipStep,
    setCurrentStep,
    updatePreferences,
    refreshProgress: fetchProgress,
    clearError: () => setError(null),
  };
};
