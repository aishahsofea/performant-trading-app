"use client";

import { useState, useEffect } from "react";
import { TradingPreferences, defaultTradingPreferences } from "@/types/profile";
import {
  Select,
  Button,
  NumberInput,
  TimeInput,
  Checkbox,
  RadioGroup,
  Alert,
} from "@repo/ui/components";
import { useTradingPreferences } from "@/hooks/useTradingPreferences";

type TradingPreferencesFormProps = {
  initialPreferences?: TradingPreferences;
  onSave?: (preferences: TradingPreferences) => Promise<void>;
};

export const TradingPreferencesForm = ({
  initialPreferences,
  onSave,
}: TradingPreferencesFormProps) => {
  const {
    preferences: savedPreferences,
    isLoading: preferencesLoading,
    updatePreferences,
  } = useTradingPreferences();
  const [preferences, setPreferences] = useState<TradingPreferences>(
    initialPreferences || defaultTradingPreferences
  );

  // Update form data when preferences load
  useEffect(() => {
    if (savedPreferences && !initialPreferences) {
      setPreferences(savedPreferences);
    }
  }, [savedPreferences, initialPreferences]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof TradingPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSuccessMessage("");
    setError("");
  };

  const handleNestedInputChange = (
    section: keyof TradingPreferences,
    field: string,
    value: any
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
    setSuccessMessage("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (onSave) {
        await onSave(preferences);
      } else {
        const success = await updatePreferences(preferences);
        if (!success) {
          throw new Error("Failed to update preferences");
        }
      }
      setSuccessMessage("Trading preferences updated successfully!");
    } catch {
      setError("Failed to update preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (preferencesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading preferences...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success/Error Messages */}
      {successMessage && (
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {/* Display Settings */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Display Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              id="defaultView"
              label="Default View"
              value={preferences.defaultView}
              onChange={(value) => handleInputChange("defaultView", value)}
              options={[
                { value: "dashboard", label: "Dashboard" },
                { value: "portfolio", label: "Portfolio" },
                { value: "analytics", label: "Analytics" },
              ]}
            />
          </div>

          <div>
            <Select
              id="theme"
              label="Theme"
              value={preferences.theme}
              onChange={(value) => handleInputChange("theme", value)}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
                { value: "auto", label: "Auto" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Performance Monitoring */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Performance Monitoring
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <NumberInput
                label="Refresh Interval (seconds)"
                min={5}
                max={300}
                value={preferences.metricsRefreshInterval}
                onChange={(e) =>
                  handleInputChange(
                    "metricsRefreshInterval",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>

            <Checkbox
              id="realTimeAlerts"
              label="Enable Real-time Alerts"
              checked={preferences.showRealTimeAlerts}
              onChange={(e) =>
                handleInputChange("showRealTimeAlerts", e.target.checked)
              }
            />
          </div>

          {/* Alert Thresholds */}
          <div>
            <h4 className="text-md font-medium text-gray-200 mb-3">
              Alert Thresholds
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <NumberInput
                  label="LCP (ms)"
                  value={preferences.alertThresholds.lcp}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "alertThresholds",
                      "lcp",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
              <div>
                <NumberInput
                  label="FID (ms)"
                  value={preferences.alertThresholds.fid}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "alertThresholds",
                      "fid",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
              <div>
                <NumberInput
                  label="CLS"
                  step={0.01}
                  value={preferences.alertThresholds.cls}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "alertThresholds",
                      "cls",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Settings */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Trading Settings
        </h3>

        <div className="space-y-6">
          <RadioGroup
            name="riskTolerance"
            label="Risk Tolerance"
            value={preferences.riskTolerance}
            onChange={(value) => handleInputChange("riskTolerance", value)}
            options={[
              { value: "conservative", label: "Conservative" },
              { value: "moderate", label: "Moderate" },
              { value: "aggressive", label: "Aggressive" },
            ]}
            orientation="horizontal"
          />

          <div>
            <h4 className="text-md font-medium text-gray-200 mb-3">
              Trading Hours
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <TimeInput
                  label="Start Time"
                  value={preferences.tradingHours.start}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "tradingHours",
                      "start",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <TimeInput
                  label="End Time"
                  value={preferences.tradingHours.end}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "tradingHours",
                      "end",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <Select
                  id="timezone"
                  label="Timezone"
                  value={preferences.tradingHours.timezone}
                  onChange={(value) =>
                    handleNestedInputChange("tradingHours", "timezone", value)
                  }
                  options={[
                    { value: "America/New_York", label: "Eastern (ET)" },
                    { value: "America/Chicago", label: "Central (CT)" },
                    { value: "America/Denver", label: "Mountain (MT)" },
                    { value: "America/Los_Angeles", label: "Pacific (PT)" },
                    { value: "Europe/London", label: "London (GMT)" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Email Notifications
        </h3>

        <div className="space-y-4">
          {Object.entries(preferences.emailNotifications).map(
            ([key, value]) => (
              <Checkbox
                key={key}
                id={key}
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                checked={value}
                onChange={(e) =>
                  handleNestedInputChange(
                    "emailNotifications",
                    key,
                    e.target.checked
                  )
                }
              />
            )
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save Trading Preferences"}
      </Button>
    </form>
  );
};
