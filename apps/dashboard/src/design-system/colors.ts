/**
 * Kraken-inspired Color Palette for Trading Dashboard
 * Based on Kraken Pro interface colors
 */

export const krakenColors = {
  // Background colors
  background: {
    primary: '#1a1b23',     // Main dark background
    secondary: '#252730',   // Sidebar/card backgrounds
    tertiary: '#2a2d3a',    // Elevated surfaces
  },
  
  // Text colors
  text: {
    primary: '#ffffff',     // Primary white text
    secondary: '#9ca3af',   // Muted gray text
    tertiary: '#6b7280',    // Subtle gray text
  },
  
  // Trading colors
  trading: {
    profit: '#22c55e',      // Green for gains/buy
    loss: '#ef4444',        // Red for losses/sell
    neutral: '#6b7280',     // Gray for neutral
    warning: '#f59e0b',     // Amber for warnings
  },
  
  // Chart colors (based on Kraken's purple theme)
  chart: {
    primary: '#8b5cf6',     // Purple primary (main chart line)
    secondary: '#a78bfa',   // Light purple
    tertiary: '#7c3aed',    // Darker purple
    accent: '#ec4899',      // Pink accent
    volume: '#4f46e5',      // Indigo for volume bars
    grid: '#374151',        // Dark gray for grid lines
  },
  
  // Status indicators
  status: {
    online: '#22c55e',      // Green - connected
    offline: '#ef4444',     // Red - disconnected
    pending: '#f59e0b',     // Amber - pending
    processing: '#8b5cf6',  // Purple - processing
  },
  
  // UI elements
  ui: {
    border: '#374151',      // Border color
    hover: '#374151',       // Hover states
    focus: '#8b5cf6',       // Focus ring
    disabled: '#4b5563',    // Disabled state
  },
  
  // Brand accent (Kraken's signature purple)
  brand: {
    primary: '#8b5cf6',     // Primary purple
    secondary: '#7c3aed',   // Darker purple
    light: '#a78bfa',       // Light purple
  },
} as const;

// Utility function to get trading color based on value
export const getTradingColor = (value: number, neutral: number = 0) => {
  if (value > neutral) return krakenColors.trading.profit;
  if (value < neutral) return krakenColors.trading.loss;
  return krakenColors.trading.neutral;
};

// CSS custom properties for theming
export const krakenCssVariables = `
  :root {
    --bg-primary: ${krakenColors.background.primary};
    --bg-secondary: ${krakenColors.background.secondary};
    --bg-tertiary: ${krakenColors.background.tertiary};
    --text-primary: ${krakenColors.text.primary};
    --text-secondary: ${krakenColors.text.secondary};
    --trading-profit: ${krakenColors.trading.profit};
    --trading-loss: ${krakenColors.trading.loss};
    --chart-primary: ${krakenColors.chart.primary};
    --brand-primary: ${krakenColors.brand.primary};
    --ui-border: ${krakenColors.ui.border};
  }
`;