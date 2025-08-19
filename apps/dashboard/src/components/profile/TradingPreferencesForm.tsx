"use client";

import { useState } from "react";
import { TradingPreferences, defaultTradingPreferences } from "@/types/profile";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomButton } from "@/components/ui/CustomButton";

type TradingPreferencesFormProps = {
  initialPreferences?: TradingPreferences;
  onSave?: (preferences: TradingPreferences) => Promise<void>;
};

export const TradingPreferencesForm = ({
  initialPreferences = defaultTradingPreferences,
  onSave,
}: TradingPreferencesFormProps) => {
  const [preferences, setPreferences] =
    useState<TradingPreferences>(initialPreferences);
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
        // TODO: Replace with actual API call
        console.log("Trading preferences update:", preferences);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setSuccessMessage("Trading preferences updated successfully!");
    } catch {
      setError("Failed to update preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="p-3 bg-green-900/20 border border-green-500 rounded-md">
          <p className="text-sm text-green-400 font-medium">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500 rounded-md">
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Display Settings */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Display Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Default View
            </label>
            <CustomSelect
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
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Theme
            </label>
            <CustomSelect
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
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Refresh Interval (seconds)
              </label>
              <input
                type="number"
                min="5"
                max="300"
                value={preferences.metricsRefreshInterval}
                onChange={(e) =>
                  handleInputChange(
                    "metricsRefreshInterval",
                    parseInt(e.target.value)
                  )
                }
                className="w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="realTimeAlerts"
                checked={preferences.showRealTimeAlerts}
                onChange={(e) =>
                  handleInputChange("showRealTimeAlerts", e.target.checked)
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
              />
              <label
                htmlFor="realTimeAlerts"
                className="ml-2 text-sm text-gray-200"
              >
                Enable Real-time Alerts
              </label>
            </div>
          </div>

          {/* Alert Thresholds */}
          <div>
            <h4 className="text-md font-medium text-gray-200 mb-3">
              Alert Thresholds
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  LCP (ms)
                </label>
                <input
                  type="number"
                  value={preferences.alertThresholds.lcp}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "alertThresholds",
                      "lcp",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  FID (ms)
                </label>
                <input
                  type="number"
                  value={preferences.alertThresholds.fid}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "alertThresholds",
                      "fid",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  CLS
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={preferences.alertThresholds.cls}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "alertThresholds",
                      "cls",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Risk Tolerance
            </label>
            <div className="flex space-x-4">
              {(["conservative", "moderate", "aggressive"] as const).map(
                (level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="riskTolerance"
                      value={level}
                      checked={preferences.riskTolerance === level}
                      onChange={(e) =>
                        handleInputChange("riskTolerance", e.target.value)
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-800"
                    />
                    <span className="ml-2 text-sm text-gray-200 capitalize">
                      {level}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-200 mb-3">
              Trading Hours
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Start Time
                </label>
                <input
                  type="time"
                  value={preferences.tradingHours.start}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "tradingHours",
                      "start",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  End Time
                </label>
                <input
                  type="time"
                  value={preferences.tradingHours.end}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "tradingHours",
                      "end",
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Timezone
                </label>
                <CustomSelect
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
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "emailNotifications",
                      key,
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor={key} className="ml-2 text-sm text-gray-200">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
              </div>
            )
          )}
        </div>
      </div>

      {/* Submit Button */}
      <CustomButton
        text={isLoading ? "Saving..." : "Save Trading Preferences"}
        disabled={isLoading}
      />
    </form>
  );
};
