"use client";

import { useState } from "react";

import { Badge } from "@repo/ui/components";
import {
  Clock,
  CheckCircle,
  User,
  Settings,
  BookOpen,
  Zap,
} from "lucide-react";
import type { OnboardingStep as OnboardingStepType } from "@/hooks/useOnboarding";
import { CompletionStepContent } from "./completion-step-content";
import { WelcomeStepContent } from "./welcome-step-content";
import { ProfileSetupStepContent } from "./profile-step-content";
import { DashboardTourStepContent } from "./dashboard-tour-step-content";
import { FeaturesOverviewStepContent } from "./features-overview-step-content";

type OnboardingStepProps = {
  step: OnboardingStepType;
  onComplete: () => void;
  onSkip: () => void;
  isProcessing: boolean;
};

export type StepContentProps = {
  stepId: string;
  onDataChange?: (data: any) => void;
};

const getStepIcon = (stepId: string) => {
  switch (stepId) {
    case "welcome":
      return User;
    case "profile-setup":
      return Settings;
    case "dashboard-tour":
      return BookOpen;
    case "features-overview":
      return Zap;
    case "completion":
      return CheckCircle;
    default:
      return User;
  }
};

const getStepContent = (stepId: string, onDataChange?: (data: any) => void) => {
  switch (stepId) {
    case "welcome":
      return <WelcomeStepContent stepId={stepId} onDataChange={onDataChange} />;
    case "profile-setup":
      return (
        <ProfileSetupStepContent stepId={stepId} onDataChange={onDataChange} />
      );
    case "dashboard-tour":
      return (
        <DashboardTourStepContent stepId={stepId} onDataChange={onDataChange} />
      );
    case "features-overview":
      return (
        <FeaturesOverviewStepContent
          stepId={stepId}
          onDataChange={onDataChange}
        />
      );
    case "completion":
      return (
        <CompletionStepContent stepId={stepId} onDataChange={onDataChange} />
      );
    default:
      return (
        <div className="text-center py-8 text-muted-foreground">
          Step content not found
        </div>
      );
  }
};

export const OnboardingStep = ({
  step,
  onComplete,
  onSkip,
  isProcessing,
}: OnboardingStepProps) => {
  const [stepData, setStepData] = useState<any>(null);
  const IconComponent = getStepIcon(step.id);

  const handleDataChange = (data: any) => {
    setStepData(data);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-violet-900/20 rounded-full flex items-center justify-center flex-shrink-0">
          <IconComponent className="h-6 w-6 text-violet-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-white">{step.title}</h2>
            {step.isRequired && <Badge className="text-xs">Required</Badge>}
          </div>
          <p className="text-white">{step.description}</p>
          {step.estimatedTime && (
            <div className="flex items-center gap-1 mt-2 text-sm text-white">
              <Clock className="h-3 w-3" />
              <span>Estimated time: {step.estimatedTime} minutes</span>
            </div>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div>{getStepContent(step.id, handleDataChange)}</div>
    </div>
  );
};
