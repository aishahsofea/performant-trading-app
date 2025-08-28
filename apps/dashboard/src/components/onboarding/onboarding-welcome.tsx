"use client";

import { useState } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Button } from "@repo/ui/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";

interface OnboardingWelcomeProps {
  onStart: () => void;
  onSkip: () => void;
}

export const OnboardingWelcome = ({
  onStart,
  onSkip,
}: OnboardingWelcomeProps) => {
  const { steps, onboardingState } = useOnboarding();
  const [isStarting, setIsStarting] = useState(false);

  const totalTime = steps.reduce(
    (sum, step) => sum + (step.estimatedTime || 0),
    0
  );
  const completedSteps = onboardingState?.completedSteps.length || 0;
  const totalSteps = steps.length;

  const handleStart = async () => {
    setIsStarting(true);
    await onStart();
    setIsStarting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Welcome to Trading Dashboard
        </CardTitle>
        <CardDescription className="text-lg">
          Let's get you set up with your personalized trading environment
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Setup Progress</span>
            <span>
              {completedSteps}/{totalSteps} completed
            </span>
          </div>
          <Progress
            value={(completedSteps / totalSteps) * 100}
            className="h-2"
          />
        </div>

        {/* Steps Preview */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">What we'll cover:</h3>
          <div className="space-y-3">
            {steps.map((step) => {
              const isCompleted = onboardingState?.completedSteps.includes(
                step.id
              );
              const isSkipped = onboardingState?.skippedSteps.includes(step.id);

              return (
                <div
                  key={step.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isSkipped ? (
                      <div className="h-5 w-5 rounded-full bg-gray-300" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{step.title}</h4>
                      {step.isRequired && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                      {isSkipped && (
                        <Badge variant="secondary" className="text-xs">
                          Skipped
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{step.estimatedTime} min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Estimate */}
        <div className="flex items-center justify-center gap-2 p-3 bg-violet-900/20 rounded-lg text-violet-300">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">
            Estimated time: {totalTime} minutes
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleStart}
            disabled={isStarting}
            className="flex-1 gap-2"
          >
            {isStarting ? "Starting..." : "Get Started"}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button variant="outline" onClick={onSkip} className="flex-1">
            Skip for now
          </Button>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-center text-muted-foreground">
          You can always access this setup later from your profile settings
        </p>
      </CardContent>
    </Card>
  );
};
