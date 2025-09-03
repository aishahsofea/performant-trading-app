import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";
import { HeavyButton, HeavyTradingChart, HeavyDataTable } from "@repo/ui/components";

interface PerformanceControlPanelProps {}

const PerformanceControlPanel: React.FC<PerformanceControlPanelProps> = () => {
  const [safeMode, setSafeMode] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<'button' | 'chart' | 'table'>('button');

  const safeSettings = {
    withExcessiveElements: false,
    animationLevel: "basic" as const,
    renderComplexity: "simple" as const,
    animationIntensity: "low" as const,
    virtualized: true,
  };

  const heavySettings = {
    withExcessiveElements: true,
    animationLevel: "extreme" as const,
    renderComplexity: "extreme" as const,
    animationIntensity: "extreme" as const,
    virtualized: false,
  };

  const settings = safeMode ? safeSettings : heavySettings;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px" }}>
      {/* Control Panel */}
      <div style={{
        background: "#1f2937",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "2px solid " + (safeMode ? "#10b981" : "#ef4444")
      }}>
        <h2 style={{ color: "white", marginTop: 0 }}>
          🎛️ Performance Control Panel
        </h2>
        
        <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "15px" }}>
          <label style={{ color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={safeMode}
              onChange={(e) => setSafeMode(e.target.checked)}
              style={{ transform: "scale(1.5)" }}
            />
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {safeMode ? "✅ SAFE MODE (Recommended)" : "⚠️ PERFORMANCE TEST MODE"}
            </span>
          </label>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          {(['button', 'chart', 'table'] as const).map((component) => (
            <button
              key={component}
              onClick={() => setSelectedComponent(component)}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                background: selectedComponent === component ? "#3b82f6" : "#6b7280",
                color: "white",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {component}
            </button>
          ))}
        </div>

        <div style={{ 
          padding: "10px", 
          background: safeMode ? "#065f46" : "#7f1d1d", 
          borderRadius: "4px",
          fontSize: "14px",
          color: "white"
        }}>
          <strong>Current Settings:</strong>
          <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
            <li>Excessive Elements: {settings.withExcessiveElements ? "ON" : "OFF"}</li>
            <li>Animation Level: {settings.animationLevel}</li>
            <li>Render Complexity: {settings.renderComplexity}</li>
            {selectedComponent === 'table' && (
              <li>Virtualization: {settings.virtualized ? "ON (100 rows)" : "OFF (3000 rows)"}</li>
            )}
          </ul>
        </div>

        {!safeMode && (
          <div style={{
            marginTop: "10px",
            padding: "10px",
            background: "#991b1b",
            borderRadius: "4px",
            color: "white",
            fontSize: "14px"
          }}>
            ⚠️ <strong>Warning:</strong> Performance Test Mode may cause browser slowdown or crashes. 
            Use Chrome DevTools Performance tab to measure impact.
          </div>
        )}
      </div>

      {/* Component Display */}
      <div style={{ 
        background: "#111827", 
        padding: "20px", 
        borderRadius: "8px",
        minHeight: "400px"
      }}>
        {selectedComponent === 'button' && (
          <div style={{ textAlign: "center" }}>
            <h3 style={{ color: "white" }}>Heavy Button Component</h3>
            <HeavyButton
              variant="heavy"
              size="lg"
              {...settings}
            >
              {safeMode ? "Safe Mode Button" : "⚠️ Heavy Performance Test"}
            </HeavyButton>
          </div>
        )}

        {selectedComponent === 'chart' && (
          <div>
            <h3 style={{ color: "white", textAlign: "center" }}>Heavy Trading Chart</h3>
            <HeavyTradingChart
              width={800}
              height={400}
              {...settings}
            />
          </div>
        )}

        {selectedComponent === 'table' && (
          <div>
            <h3 style={{ color: "white", textAlign: "center" }}>Heavy Data Table</h3>
            <HeavyDataTable {...settings} />
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: "20px",
        padding: "15px",
        background: "#374151",
        borderRadius: "8px",
        color: "white",
        fontSize: "14px"
      }}>
        <h4 style={{ marginTop: 0, color: "#fbbf24" }}>📖 How to Use:</h4>
        <ol style={{ paddingLeft: "20px" }}>
          <li><strong>Safe Mode (Default):</strong> Components are optimized for smooth Storybook experience</li>
          <li><strong>Performance Test Mode:</strong> Deliberately creates performance bottlenecks for learning</li>
          <li><strong>Individual Controls:</strong> Use the component-specific stories to fine-tune specific settings</li>
          <li><strong>Performance Measurement:</strong> Open Chrome DevTools → Performance tab → Record while toggling modes</li>
        </ol>
      </div>
    </div>
  );
};

const meta = {
  title: "Heavy Components/🎛️ Performance Control Panel",
  component: PerformanceControlPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Master control panel to safely test performance impact of heavy components. Toggle between safe mode and performance test mode.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PerformanceControlPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ControlPanel: Story = {
  args: {},
};