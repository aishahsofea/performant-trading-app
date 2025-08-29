import { useSession } from "next-auth/react";
import { useState } from "react";
import { StepContentProps } from "./onboarding-step";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Switch,
} from "@repo/ui/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const ProfileSetupStepContent = ({ onDataChange }: StepContentProps) => {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState({
    tradingExperience: "",
    primaryGoals: "",
    riskTolerance: "",
    notifications: true,
    marketUpdates: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    const updated = { ...preferences, [field]: value };
    setPreferences(updated);
    onDataChange?.(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Trading Profile</CardTitle>
        <CardDescription>
          Help us personalize your dashboard by sharing some information about
          your trading goals and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Select
            id="experience"
            label="Trading Experience Level"
            value={preferences.tradingExperience}
            onValueChange={(value: string) =>
              handleChange("tradingExperience", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">
                Beginner (Less than 1 year)
              </SelectItem>
              <SelectItem value="intermediate">
                Intermediate (1-3 years)
              </SelectItem>
              <SelectItem value="experienced">
                Experienced (3+ years)
              </SelectItem>
              <SelectItem value="professional">Professional Trader</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Primary Trading Goals</Label>
          <Textarea
            id="goals"
            placeholder="e.g., Build long-term wealth, Generate monthly income, Learn market fundamentals..."
            value={preferences.primaryGoals}
            onChange={(e) => handleChange("primaryGoals", e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Select
            id="risk"
            label="Risk Tolerance"
            value={preferences.riskTolerance}
            onValueChange={(value: string) =>
              handleChange("riskTolerance", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your risk tolerance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">
                Conservative - Prefer stable, lower-risk investments
              </SelectItem>
              <SelectItem value="moderate">
                Moderate - Balanced approach to risk and reward
              </SelectItem>
              <SelectItem value="aggressive">
                Aggressive - Comfortable with higher risk for higher potential
                returns
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-xl">Notification Preferences</Label>
          <div className="space-y-3 my-1.5">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-bold">
                  Performance Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about significant portfolio changes
                </p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) =>
                  handleChange("notifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="market-updates" className="font-bold">
                  Market Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily market summaries and insights
                </p>
              </div>
              <Switch
                id="market-updates"
                checked={preferences.marketUpdates}
                onCheckedChange={(checked) =>
                  handleChange("marketUpdates", checked)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
