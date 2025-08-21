"use client";

import { useState, useEffect } from "react";
import { PortfolioSettings, defaultPortfolioSettings } from "@/types/portfolio";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomButton } from "@/components/ui/CustomButton";
import { usePortfolioSettings } from "@/hooks/usePortfolioSettings";

type PortfolioSettingsFormProps = {
  initialSettings?: PortfolioSettings;
  onSave?: (settings: PortfolioSettings) => Promise<void>;
};

export const PortfolioSettingsForm = ({
  initialSettings,
  onSave,
}: PortfolioSettingsFormProps) => {
  const { settings: savedSettings, isLoading: settingsLoading, updateSettings } = usePortfolioSettings();
  const [settings, setSettings] = useState<PortfolioSettings>(
    initialSettings || defaultPortfolioSettings
  );
  
  // Update form data when settings load
  useEffect(() => {
    if (savedSettings && !initialSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings, initialSettings]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof PortfolioSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSuccessMessage("");
    setError("");
  };

  const handleNestedInputChange = (
    section: keyof PortfolioSettings,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
    setSuccessMessage("");
    setError("");
  };

  const handleAllocationChange = (asset: string, value: number) => {
    setSettings((prev) => ({
      ...prev,
      targetAllocations: {
        ...prev.targetAllocations,
        [asset]: value,
      },
    }));
    setSuccessMessage("");
    setError("");
  };

  const getTotalAllocation = () => {
    return Object.values(settings.targetAllocations).reduce(
      (sum, value) => sum + value,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate allocations
    const totalAllocation = getTotalAllocation();
    if (Math.abs(totalAllocation - 100) > 0.1) {
      setError(
        `Target allocations must total 100% (currently ${totalAllocation.toFixed(
          1
        )}%)`
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (onSave) {
        await onSave(settings);
      } else {
        const success = await updateSettings(settings);
        if (!success) {
          throw new Error("Failed to update portfolio settings");
        }
      }
      setSuccessMessage("Portfolio settings updated successfully!");
    } catch {
      setError("Failed to update portfolio settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading portfolio settings...</div>
      </div>
    );
  }

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
              Default Currency
            </label>
            <CustomSelect
              value={settings.defaultCurrency}
              onChange={(value) => handleInputChange("defaultCurrency", value)}
              options={[
                { value: "USD", label: "US Dollar (USD)" },
                { value: "EUR", label: "Euro (EUR)" },
                { value: "GBP", label: "British Pound (GBP)" },
                { value: "JPY", label: "Japanese Yen (JPY)" },
                { value: "CAD", label: "Canadian Dollar (CAD)" },
                { value: "AUD", label: "Australian Dollar (AUD)" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Display Mode
            </label>
            <CustomSelect
              value={settings.displayMode}
              onChange={(value) => handleInputChange("displayMode", value)}
              options={[
                { value: "detailed", label: "Detailed View" },
                { value: "compact", label: "Compact View" },
                { value: "grid", label: "Grid View" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Sort By
            </label>
            <CustomSelect
              value={settings.sortBy}
              onChange={(value) => handleInputChange("sortBy", value)}
              options={[
                { value: "name", label: "Name" },
                { value: "value", label: "Value" },
                { value: "performance", label: "Performance" },
                { value: "allocation", label: "Allocation" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Sort Order
            </label>
            <CustomSelect
              value={settings.sortOrder}
              onChange={(value) => handleInputChange("sortOrder", value)}
              options={[
                { value: "asc", label: "Ascending" },
                { value: "desc", label: "Descending" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Performance Tracking */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Performance Tracking
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Benchmark Index
              </label>
              <CustomSelect
                value={settings.benchmarkIndex}
                onChange={(value) => handleInputChange("benchmarkIndex", value)}
                options={[
                  { value: "SPY", label: "S&P 500 (SPY)" },
                  { value: "QQQ", label: "NASDAQ 100 (QQQ)" },
                  { value: "VTI", label: "Total Stock Market (VTI)" },
                  { value: "IWM", label: "Russell 2000 (IWM)" },
                  { value: "EFA", label: "International Stocks (EFA)" },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Default Performance Period
              </label>
              <CustomSelect
                value={settings.performancePeriod}
                onChange={(value) =>
                  handleInputChange("performancePeriod", value)
                }
                options={[
                  { value: "1D", label: "1 Day" },
                  { value: "1W", label: "1 Week" },
                  { value: "1M", label: "1 Month" },
                  { value: "3M", label: "3 Months" },
                  { value: "6M", label: "6 Months" },
                  { value: "1Y", label: "1 Year" },
                  { value: "YTD", label: "Year to Date" },
                  { value: "ALL", label: "All Time" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showUnrealizedGains"
                checked={settings.showUnrealizedGains}
                onChange={(e) =>
                  handleInputChange("showUnrealizedGains", e.target.checked)
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
              />
              <label
                htmlFor="showUnrealizedGains"
                className="ml-2 text-sm text-gray-200"
              >
                Show Unrealized Gains/Losses
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showDividends"
                checked={settings.showDividends}
                onChange={(e) =>
                  handleInputChange("showDividends", e.target.checked)
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
              />
              <label
                htmlFor="showDividends"
                className="ml-2 text-sm text-gray-200"
              >
                Include Dividends in Performance
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Risk Management
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Max Position Size (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.positionSizeLimit}
                onChange={(e) =>
                  handleInputChange(
                    "positionSizeLimit",
                    parseInt(e.target.value)
                  )
                }
                className="w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Max Drawdown Alert (%)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.maxDrawdownAlert}
                onChange={(e) =>
                  handleInputChange(
                    "maxDrawdownAlert",
                    parseInt(e.target.value)
                  )
                }
                className="w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Rebalance Threshold (%)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.rebalanceThreshold}
                onChange={(e) =>
                  handleInputChange(
                    "rebalanceThreshold",
                    parseInt(e.target.value)
                  )
                }
                className="w-full border border-gray-600 rounded-md px-3 py-2.5 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableRiskAlerts"
              checked={settings.enableRiskAlerts}
              onChange={(e) =>
                handleInputChange("enableRiskAlerts", e.target.checked)
              }
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
            />
            <label
              htmlFor="enableRiskAlerts"
              className="ml-2 text-sm text-gray-200"
            >
              Enable Risk Management Alerts
            </label>
          </div>
        </div>
      </div>

      {/* Target Allocations */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Target Asset Allocation
          <span
            className={`ml-2 text-sm ${
              getTotalAllocation() === 100 ? "text-green-400" : "text-red-400"
            }`}
          >
            (Total: {getTotalAllocation().toFixed(1)}%)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(settings.targetAllocations).map(([asset, value]) => (
            <div key={asset}>
              <label className="block text-sm font-medium mb-1 text-gray-300 capitalize">
                {asset} (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={value}
                onChange={(e) =>
                  handleAllocationChange(asset, parseFloat(e.target.value) || 0)
                }
                className="w-full border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-100 bg-gray-800 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Chart Settings */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Chart Settings
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Default Timeframe
              </label>
              <CustomSelect
                value={settings.chartSettings.defaultTimeframe}
                onChange={(value) =>
                  handleNestedInputChange(
                    "chartSettings",
                    "defaultTimeframe",
                    value
                  )
                }
                options={[
                  { value: "1D", label: "1 Day" },
                  { value: "1W", label: "1 Week" },
                  { value: "1M", label: "1 Month" },
                  { value: "3M", label: "3 Months" },
                  { value: "6M", label: "6 Months" },
                  { value: "1Y", label: "1 Year" },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Chart Type
              </label>
              <CustomSelect
                value={settings.chartSettings.chartType}
                onChange={(value) =>
                  handleNestedInputChange("chartSettings", "chartType", value)
                }
                options={[
                  { value: "line", label: "Line Chart" },
                  { value: "candlestick", label: "Candlestick" },
                  { value: "area", label: "Area Chart" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showVolume"
                checked={settings.chartSettings.showVolume}
                onChange={(e) =>
                  handleNestedInputChange(
                    "chartSettings",
                    "showVolume",
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
              />
              <label
                htmlFor="showVolume"
                className="ml-2 text-sm text-gray-200"
              >
                Show Volume Indicator
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showMovingAverages"
                checked={settings.chartSettings.showMovingAverages}
                onChange={(e) =>
                  handleNestedInputChange(
                    "chartSettings",
                    "showMovingAverages",
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
              />
              <label
                htmlFor="showMovingAverages"
                className="ml-2 text-sm text-gray-200"
              >
                Show Moving Averages
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Notifications */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Portfolio Notifications
        </h3>

        <div className="space-y-4">
          {Object.entries(settings.portfolioNotifications).map(
            ([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={(e) =>
                    handleNestedInputChange(
                      "portfolioNotifications",
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
        text={isLoading ? "Saving..." : "Save Portfolio Settings"}
        disabled={isLoading}
      />
    </form>
  );
};
