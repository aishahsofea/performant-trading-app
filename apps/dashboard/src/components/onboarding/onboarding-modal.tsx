"use client";

import { useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import {
  Dialog,
  DialogContent,
  DialogBody,
  DialogFooter,
} from "@repo/ui/components";
import { Button } from "@repo/ui/components";
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
      <DialogContent className="max-w-4xl">
        <DialogBody>
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
        </DialogBody>

        {!showWelcome && currentStep && (
          <DialogFooter className="flex items-center justify-between pt-4">
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
              {currentStep.isRequired ? null : (
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
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
