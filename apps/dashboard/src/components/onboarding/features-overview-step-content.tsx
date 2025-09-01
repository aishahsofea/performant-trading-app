import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components";
import { StepContentProps } from "./onboarding-step";
import { CheckCircle, BookOpen, Zap } from "lucide-react";

export const FeaturesOverviewStepContent = ({
  onDataChange,
}: StepContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discover Powerful Features</CardTitle>
        <CardDescription>
          Explore advanced features designed to enhance your trading performance
          and decision-making process.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h4 className="font-medium">Performance Analytics</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Advanced analytics including Sharpe ratio, maximum drawdown,
                  win rate, and risk-adjusted returns.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-violet-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <h4 className="font-medium">Smart Alerts</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Customizable alerts for price movements, portfolio changes,
                  and performance milestones.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-violet-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <h4 className="font-medium">Trading Journal</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Track your trades, document strategies, and analyze what works
                  best for your trading style.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-900/20 border border-amber-600 rounded-lg">
          <p className="text-sm text-amber-300">
            <strong>Coming Soon:</strong> AI-powered insights and
            recommendations based on your trading patterns and market
            conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
