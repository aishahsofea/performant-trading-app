import { Card, CardContent } from "@repo/ui/components";
import { CheckCircle } from "lucide-react";
import { StepContentProps } from "./onboarding-step";

export const CompletionStepContent = ({ onDataChange }: StepContentProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Setup Complete!</h3>
            <p className="text-muted-foreground">
              Congratulations! Your trading dashboard is now configured and
              ready to use. You can start monitoring your performance and
              exploring all the features.
            </p>
          </div>

          <div className="mt-6 p-4 bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-400 mb-2">What's Next?</h4>
            <ul className="text-sm text-green-300 space-y-1 list-disc list-inside">
              <li>Explore your personalized dashboard</li>
              <li>Set up your first portfolio tracking</li>
              <li>Configure performance alerts</li>
              <li>Start recording your trades</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Need help getting started? Check out our help center or contact
            support.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
