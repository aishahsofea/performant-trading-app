// Onboarding step types
export type OnboardingStepType = 
  | 'welcome'
  | 'profile-setup'
  | 'preferences'
  | 'dashboard-tour'
  | 'features-overview'
  | 'completion';

export type OnboardingStep = {
  id: string;
  type: OnboardingStepType;
  title: string;
  description: string;
  component?: string;
  isRequired: boolean;
  estimatedTime?: number; // in minutes
  dependencies?: string[]; // step IDs that must be completed first
};

export type OnboardingProgress = {
  userId: string;
  currentStepId: string | null;
  completedSteps: string[];
  skippedSteps: string[];
  startedAt: string;
  completedAt?: string;
  isComplete: boolean;
  preferences: {
    showTips: boolean;
    skipOptionalSteps: boolean;
    tourSpeed: 'slow' | 'normal' | 'fast';
  };
};

// Tour step for guided tours
export type TourStep = {
  target: string; // CSS selector for the target element
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  showSkip?: boolean;
  showNext?: boolean;
  showPrev?: boolean;
  action?: {
    type: 'click' | 'hover' | 'focus' | 'wait';
    element?: string;
    delay?: number;
  };
};

export type GuidedTour = {
  id: string;
  name: string;
  description: string;
  category: 'dashboard' | 'trading' | 'performance' | 'profile';
  steps: TourStep[];
  isRequired: boolean;
  prerequisites?: string[];
};

// User's onboarding state
export type UserOnboardingState = {
  hasSeenWelcome: boolean;
  hasCompletedProfileSetup: boolean;
  hasCompletedPreferences: boolean;
  hasCompletedDashboardTour: boolean;
  completedTours: string[];
  showTooltips: boolean;
  onboardingComplete: boolean;
  lastActiveStep?: string;
  progress: number; // 0-100
};