"use client";

import { useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@repo/ui/components";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { OnboardingWelcome } from "./onboarding-welcome";
import { OnboardingStep } from "./onboarding-step";
import { X, ArrowLeft, ArrowRight, Check } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const {
    onboardingState,
    steps,
    currentStep,
    nextStep,
    prevStep,
    completeStep,
    skipStep,
    setCurrentStep,
    updatePreferences,
  } = useOnboarding();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(!currentStep);

  if (!onboardingState) return null;

  const currentStepIndex = currentStep
    ? steps.findIndex((s) => s.id === currentStep.id)
    : -1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const isFirstStep = currentStepIndex <= 0;
  const isLastStep = currentStepIndex >= steps.length - 1;

  const handleStartOnboarding = async () => {
    setIsProcessing(true);
    await setCurrentStep("welcome");
    setShowWelcome(false);
    setIsProcessing(false);
  };

  const handleSkipOnboarding = async () => {
    await updatePreferences({ isComplete: true });
    onClose();
  };

  const handleCompleteStep = async () => {
    if (!currentStep) return;

    setIsProcessing(true);
    const success = await completeStep(currentStep.id);

    if (success && nextStep) {
      await setCurrentStep(nextStep.id);
    } else if (success && !nextStep) {
      // Final step completed
      onClose();
    }

    setIsProcessing(false);
  };

  const handleSkipStep = async () => {
    if (!currentStep) return;

    setIsProcessing(true);
    const success = await skipStep(currentStep.id);

    if (success && nextStep) {
      await setCurrentStep(nextStep.id);
    } else if (success && !nextStep) {
      onClose();
    }

    setIsProcessing(false);
  };

  const handlePreviousStep = async () => {
    if (prevStep) {
      await setCurrentStep(prevStep.id);
    }
  };

  const handleClose = async () => {
    // Save current progress and close
    if (currentStep && !onboardingState.isComplete) {
      await updatePreferences({
        currentStepId: currentStep.id,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-xl font-semibold">
            {showWelcome ? "Welcome!" : currentStep?.title || "Setup"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {!showWelcome && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="py-4">
          {showWelcome ? (
            <OnboardingWelcome
              onStart={handleStartOnboarding}
              onSkip={handleSkipOnboarding}
            />
          ) : currentStep ? (
            <OnboardingStep
              step={currentStep}
              onComplete={handleCompleteStep}
              onSkip={handleSkipStep}
              isProcessing={isProcessing}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}
        </div>

        {!showWelcome && currentStep && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={isFirstStep || isProcessing}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {currentStep.isRequired ? (
                <Badge variant="outline" className="text-xs">
                  Required
                </Badge>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleSkipStep}
                  disabled={isProcessing}
                >
                  Skip
                </Button>
              )}

              <Button
                onClick={handleCompleteStep}
                disabled={isProcessing}
                className="gap-2"
              >
                {isProcessing ? (
                  "Processing..."
                ) : isLastStep ? (
                  <>
                    Complete
                    <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
