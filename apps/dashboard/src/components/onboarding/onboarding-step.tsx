"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, User, Settings, BookOpen, Zap } from 'lucide-react';
import type { OnboardingStep as OnboardingStepType } from '@/hooks/useOnboarding';

interface OnboardingStepProps {
  step: OnboardingStepType;
  onComplete: () => void;
  onSkip: () => void;
  isProcessing: boolean;
}

interface StepContentProps {
  stepId: string;
  onDataChange?: (data: any) => void;
}

const WelcomeStepContent = ({ onDataChange }: StepContentProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Welcome to your Trading Dashboard!</h3>
            <p className="text-muted-foreground">
              We're excited to help you get started with your personal trading and performance monitoring environment. 
              This quick setup will customize your dashboard based on your trading preferences and goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 border rounded-lg">
              <Settings className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium">Customize</h4>
              <p className="text-sm text-muted-foreground">Set up your preferences</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium">Learn</h4>
              <p className="text-sm text-muted-foreground">Discover key features</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium">Trade</h4>
              <p className="text-sm text-muted-foreground">Start monitoring performance</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProfileSetupStepContent = ({ onDataChange }: StepContentProps) => {
  const { data: session } = useSession();
  const [preferences, setPreferences] = useState({
    tradingExperience: '',
    primaryGoals: '',
    riskTolerance: '',
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
          Help us personalize your dashboard by sharing some information about your trading goals and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="experience">Trading Experience Level</Label>
          <Select value={preferences.tradingExperience} onValueChange={(value: string) => handleChange('tradingExperience', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (Less than 1 year)</SelectItem>
              <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
              <SelectItem value="experienced">Experienced (3+ years)</SelectItem>
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
            onChange={(e) => handleChange('primaryGoals', e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="risk">Risk Tolerance</Label>
          <Select value={preferences.riskTolerance} onValueChange={(value: string) => handleChange('riskTolerance', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your risk tolerance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative - Prefer stable, lower-risk investments</SelectItem>
              <SelectItem value="moderate">Moderate - Balanced approach to risk and reward</SelectItem>
              <SelectItem value="aggressive">Aggressive - Comfortable with higher risk for higher potential returns</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Notification Preferences</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-normal">Performance Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about significant portfolio changes</p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) => handleChange('notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="market-updates" className="font-normal">Market Updates</Label>
                <p className="text-sm text-muted-foreground">Receive daily market summaries and insights</p>
              </div>
              <Switch
                id="market-updates"
                checked={preferences.marketUpdates}
                onCheckedChange={(checked) => handleChange('marketUpdates', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardTourStepContent = ({ onDataChange }: StepContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Tour</CardTitle>
        <CardDescription>
          Let's take a quick tour of your dashboard's key features and how to customize your trading workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">1</div>
              Performance Overview
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Monitor your portfolio performance with real-time charts, P&L tracking, and performance metrics.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">2</div>
              Layout Customization
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Customize your dashboard layout, save different configurations, and switch between trading setups.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">3</div>
              Real-time Data
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Access real-time market data, price alerts, and technical indicators for informed decision making.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">4</div>
              Analytics & Reports
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Generate detailed performance reports, analyze trading patterns, and track your progress over time.
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Pro Tip:</strong> You can always access help tooltips by clicking the "?" icon next to any feature.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturesOverviewStepContent = ({ onDataChange }: StepContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discover Powerful Features</CardTitle>
        <CardDescription>
          Explore advanced features designed to enhance your trading performance and decision-making process.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Performance Analytics</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Advanced analytics including Sharpe ratio, maximum drawdown, win rate, and risk-adjusted returns.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Smart Alerts</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Customizable alerts for price movements, portfolio changes, and performance milestones.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Trading Journal</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Track your trades, document strategies, and analyze what works best for your trading style.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Coming Soon:</strong> AI-powered insights and recommendations based on your trading patterns and market conditions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const CompletionStepContent = ({ onDataChange }: StepContentProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Setup Complete!</h3>
            <p className="text-muted-foreground">
              Congratulations! Your trading dashboard is now configured and ready to use. 
              You can start monitoring your performance and exploring all the features.
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
              <li>Explore your personalized dashboard</li>
              <li>Set up your first portfolio tracking</li>
              <li>Configure performance alerts</li>
              <li>Start recording your trades</li>
            </ul>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Need help getting started? Check out our help center or contact support.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const getStepIcon = (stepId: string) => {
  switch (stepId) {
    case 'welcome': return User;
    case 'profile-setup': return Settings;
    case 'dashboard-tour': return BookOpen;
    case 'features-overview': return Zap;
    case 'completion': return CheckCircle;
    default: return User;
  }
};

const getStepContent = (stepId: string, onDataChange?: (data: any) => void) => {
  switch (stepId) {
    case 'welcome':
      return <WelcomeStepContent stepId={stepId} onDataChange={onDataChange} />;
    case 'profile-setup':
      return <ProfileSetupStepContent stepId={stepId} onDataChange={onDataChange} />;
    case 'dashboard-tour':
      return <DashboardTourStepContent stepId={stepId} onDataChange={onDataChange} />;
    case 'features-overview':
      return <FeaturesOverviewStepContent stepId={stepId} onDataChange={onDataChange} />;
    case 'completion':
      return <CompletionStepContent stepId={stepId} onDataChange={onDataChange} />;
    default:
      return <div className="text-center py-8 text-muted-foreground">Step content not found</div>;
  }
};

export const OnboardingStep = ({ step, onComplete, onSkip, isProcessing }: OnboardingStepProps) => {
  const [stepData, setStepData] = useState<any>(null);
  const IconComponent = getStepIcon(step.id);

  const handleDataChange = (data: any) => {
    setStepData(data);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <IconComponent className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold">{step.title}</h2>
            {step.isRequired && (
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{step.description}</p>
          {step.estimatedTime && (
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Estimated time: {step.estimatedTime} minutes</span>
            </div>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div>
        {getStepContent(step.id, handleDataChange)}
      </div>
    </div>
  );
};
