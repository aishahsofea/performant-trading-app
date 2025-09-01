import { StepContentProps } from "./onboarding-step";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components";

export const DashboardTourStepContent = ({
  onDataChange,
}: StepContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Tour</CardTitle>
        <CardDescription>
          Let's take a quick tour of your dashboard's key features and how to
          customize your trading workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-6 h-6 bg-violet-900/20 rounded-full flex items-center justify-center text-sm font-bold text-violet-400">
                1
              </div>
              Performance Overview
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Monitor your portfolio performance with real-time charts, P&L
              tracking, and performance metrics.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-6 h-6 bg-violet-900/20 rounded-full flex items-center justify-center text-sm font-bold text-violet-400">
                2
              </div>
              Layout Customization
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Customize your dashboard layout, save different configurations,
              and switch between trading setups.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-6 h-6 bg-violet-900/20 rounded-full flex items-center justify-center text-sm font-bold text-violet-400">
                3
              </div>
              Real-time Data
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Access real-time market data, price alerts, and technical
              indicators for informed decision making.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-6 h-6 bg-violet-900/20 rounded-full flex items-center justify-center text-sm font-bold text-violet-400">
                4
              </div>
              Analytics & Reports
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Generate detailed performance reports, analyze trading patterns,
              and track your progress over time.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-violet-900/20 rounded-lg">
          <p className="text-sm text-violet-300">
            <strong>Pro Tip:</strong> You can always access help tooltips by
            clicking the "?" icon next to any feature.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
