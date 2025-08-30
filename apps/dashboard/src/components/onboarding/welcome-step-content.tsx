import { Card, CardContent } from "@repo/ui/components";
import { User, Settings, BookOpen, Zap } from "lucide-react";
import { StepContentProps } from "./onboarding-step";

export const WelcomeStepContent = ({ onDataChange }: StepContentProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-violet-900/20 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Welcome to your Trading Dashboard!
            </h3>
            <p className="text-muted-foreground">
              We're excited to help you get started with your personal trading
              and performance monitoring environment. This quick setup will
              customize your dashboard based on your trading preferences and
              goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 border rounded-lg">
              <Settings className="h-6 w-6 mx-auto mb-2 text-violet-400" />
              <h4 className="font-medium">Customize</h4>
              <p className="text-sm text-muted-foreground">
                Set up your preferences
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-400" />
              <h4 className="font-medium">Learn</h4>
              <p className="text-sm text-muted-foreground">
                Discover key features
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-6 w-6 mx-auto mb-2 text-violet-400" />
              <h4 className="font-medium">Trade</h4>
              <p className="text-sm text-muted-foreground">
                Start monitoring performance
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
