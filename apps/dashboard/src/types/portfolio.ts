export type PortfolioSettings = {
  // Display Preferences
  defaultCurrency: string;
  displayMode: 'detailed' | 'compact' | 'grid';
  sortBy: 'name' | 'value' | 'performance' | 'allocation';
  sortOrder: 'asc' | 'desc';
  
  // Performance Tracking
  benchmarkIndex: string;
  performancePeriod: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'ALL';
  showUnrealizedGains: boolean;
  showDividends: boolean;
  
  // Risk Management
  positionSizeLimit: number; // percentage
  maxDrawdownAlert: number; // percentage
  rebalanceThreshold: number; // percentage
  enableRiskAlerts: boolean;
  
  // Allocation Settings
  targetAllocations: {
    stocks: number;
    bonds: number;
    crypto: number;
    cash: number;
    commodities: number;
    realEstate: number;
  };
  
  // Display Options
  chartSettings: {
    defaultTimeframe: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';
    chartType: 'line' | 'candlestick' | 'area';
    showVolume: boolean;
    showMovingAverages: boolean;
  };
  
  // Notifications
  portfolioNotifications: {
    dailyPerformance: boolean;
    weeklyReport: boolean;
    rebalanceAlerts: boolean;
    significantMoves: boolean; // +/- 5% moves
    allocationDrift: boolean;
  };
};

export const defaultPortfolioSettings: PortfolioSettings = {
  defaultCurrency: 'USD',
  displayMode: 'detailed',
  sortBy: 'value',
  sortOrder: 'desc',
  
  benchmarkIndex: 'SPY',
  performancePeriod: '1Y',
  showUnrealizedGains: true,
  showDividends: true,
  
  positionSizeLimit: 20,
  maxDrawdownAlert: 15,
  rebalanceThreshold: 5,
  enableRiskAlerts: true,
  
  targetAllocations: {
    stocks: 60,
    bonds: 20,
    crypto: 10,
    cash: 5,
    commodities: 3,
    realEstate: 2,
  },
  
  chartSettings: {
    defaultTimeframe: '1M',
    chartType: 'line',
    showVolume: true,
    showMovingAverages: false,
  },
  
  portfolioNotifications: {
    dailyPerformance: false,
    weeklyReport: true,
    rebalanceAlerts: true,
    significantMoves: true,
    allocationDrift: true,
  },
};