"use client";

import { useState, useEffect } from "react";
import { PortfolioSettings, defaultPortfolioSettings } from "@/types/portfolio";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, NumberInput, Checkbox, Alert } from "@repo/ui/components";
import { usePortfolioSettings } from "@/hooks/usePortfolioSettings";

type PortfolioSettingsFormProps = {
  initialSettings?: PortfolioSettings;
  onSave?: (settings: PortfolioSettings) => Promise<void>;
};

export const PortfolioSettingsForm = ({
  initialSettings,
  onSave,
}: PortfolioSettingsFormProps) => {
  const {
    settings: savedSettings,
    isLoading: settingsLoading,
    updateSettings,
  } = usePortfolioSettings();
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
              label="Default Currency"
              value={settings.defaultCurrency}
              onValueChange={(value) => handleInputChange("defaultCurrency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              label="Display Mode"
              value={settings.displayMode}
              onValueChange={(value) => handleInputChange("displayMode", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select display mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detailed">Detailed View</SelectItem>
                <SelectItem value="compact">Compact View</SelectItem>
                <SelectItem value="grid">Grid View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              label="Sort By"
              value={settings.sortBy}
              onValueChange={(value) => handleInputChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sort field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="value">Value</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="allocation">Allocation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              label="Sort Order"
              value={settings.sortOrder}
              onValueChange={(value) => handleInputChange("sortOrder", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
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
              <Select
                label="Benchmark Index"
                value={settings.benchmarkIndex}
                onValueChange={(value) => handleInputChange("benchmarkIndex", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select benchmark" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SPY">S&P 500 (SPY)</SelectItem>
                  <SelectItem value="QQQ">NASDAQ 100 (QQQ)</SelectItem>
                  <SelectItem value="VTI">Total Stock Market (VTI)</SelectItem>
                  <SelectItem value="IWM">Russell 2000 (IWM)</SelectItem>
                  <SelectItem value="EFA">International Stocks (EFA)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                label="Default Performance Period"
                value={settings.performancePeriod}
                onValueChange={(value) =>
                  handleInputChange("performancePeriod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1D">1 Day</SelectItem>
                  <SelectItem value="1W">1 Week</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="YTD">Year to Date</SelectItem>
                  <SelectItem value="ALL">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Checkbox
              id="showUnrealizedGains"
              label="Show Unrealized Gains/Losses"
              checked={settings.showUnrealizedGains}
              onChange={(e) =>
                handleInputChange("showUnrealizedGains", e.target.checked)
              }
            />

            <Checkbox
              id="showDividends"
              label="Include Dividends in Performance"
              checked={settings.showDividends}
              onChange={(e) =>
                handleInputChange("showDividends", e.target.checked)
              }
            />
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
              <NumberInput
                label="Max Position Size (%)"
                min={1}
                max={100}
                value={settings.positionSizeLimit}
                onChange={(e) =>
                  handleInputChange(
                    "positionSizeLimit",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <NumberInput
                label="Max Drawdown Alert (%)"
                min={1}
                max={50}
                value={settings.maxDrawdownAlert}
                onChange={(e) =>
                  handleInputChange(
                    "maxDrawdownAlert",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <NumberInput
                label="Rebalance Threshold (%)"
                min={1}
                max={20}
                value={settings.rebalanceThreshold}
                onChange={(e) =>
                  handleInputChange(
                    "rebalanceThreshold",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
          </div>

          <Checkbox
            id="enableRiskAlerts"
            label="Enable Risk Management Alerts"
            checked={settings.enableRiskAlerts}
            onChange={(e) =>
              handleInputChange("enableRiskAlerts", e.target.checked)
            }
          />
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
              <NumberInput
                min={0}
                max={100}
                step={0.1}
                value={value}
                onChange={(e) =>
                  handleAllocationChange(asset, parseFloat(e.target.value) || 0)
                }
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
              <Select
                label="Default Timeframe"
                value={settings.chartSettings.defaultTimeframe}
                onValueChange={(value) =>
                  handleNestedInputChange(
                    "chartSettings",
                    "defaultTimeframe",
                    value
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1D">1 Day</SelectItem>
                  <SelectItem value="1W">1 Week</SelectItem>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="3M">3 Months</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                label="Chart Type"
                value={settings.chartSettings.chartType}
                onValueChange={(value) =>
                  handleNestedInputChange("chartSettings", "chartType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="candlestick">Candlestick</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Checkbox
              id="showVolume"
              label="Show Volume Indicator"
              checked={settings.chartSettings.showVolume}
              onChange={(e) =>
                handleNestedInputChange(
                  "chartSettings",
                  "showVolume",
                  e.target.checked
                )
              }
            />

            <Checkbox
              id="showMovingAverages"
              label="Show Moving Averages"
              checked={settings.chartSettings.showMovingAverages}
              onChange={(e) =>
                handleNestedInputChange(
                  "chartSettings",
                  "showMovingAverages",
                  e.target.checked
                )
              }
            />
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
              <Checkbox
                key={key}
                id={key}
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                checked={value}
                onChange={(e) =>
                  handleNestedInputChange(
                    "portfolioNotifications",
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
        {isLoading ? "Saving..." : "Save Portfolio Settings"}
      </Button>
    </form>
  );
};
