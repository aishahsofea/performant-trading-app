"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingModal } from "./onboarding-modal";

interface OnboardingContextType {
  showOnboarding: () => void;
  hideOnboarding: () => void;
  isOnboardingVisible: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const { status } = useSession();
  const { shouldShowOnboarding, isLoading } = useOnboarding();
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  // Auto-show onboarding for new users
  useEffect(() => {
    if (status === "loading" || isLoading) return;
    if (status === "unauthenticated") return;
    if (hasCheckedOnboarding) return;

    // Only auto-show for authenticated users who should see onboarding
    if (status === "authenticated" && shouldShowOnboarding) {
      setIsOnboardingVisible(true);
    }

    setHasCheckedOnboarding(true);
  }, [status, shouldShowOnboarding, isLoading, hasCheckedOnboarding]);

  const showOnboarding = () => {
    setIsOnboardingVisible(true);
  };

  const hideOnboarding = () => {
    setIsOnboardingVisible(false);
  };

  const contextValue: OnboardingContextType = {
    showOnboarding,
    hideOnboarding,
    isOnboardingVisible,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}

      {/* Onboarding Modal */}
      {status === "authenticated" && (
        <OnboardingModal
          isOpen={isOnboardingVisible}
          onClose={hideOnboarding}
        />
      )}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingContext must be used within OnboardingProvider"
    );
  }
  return context;
};
