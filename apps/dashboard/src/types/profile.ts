export type TradingPreferences = {
  // Display Settings
  defaultView: 'dashboard' | 'portfolio' | 'analytics';
  theme: 'light' | 'dark' | 'auto';
  
  // Performance Monitoring Preferences
  metricsRefreshInterval: number; // in seconds
  showRealTimeAlerts: boolean;
  alertThresholds: {
    lcp: number; // ms
    fid: number; // ms
    cls: number; // score
    ttfb: number; // ms
    inp: number; // ms
  };
  
  // Trading Settings
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  tradingHours: {
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string;
  };
  
  // Notification Settings
  emailNotifications: {
    performanceAlerts: boolean;
    dailySummary: boolean;
    weeklyReport: boolean;
    systemUpdates: boolean;
  };
  
  // Dashboard Layout
  dashboardLayout: {
    pinnedMetrics: string[]; // metric names
    widgetPositions: Record<string, { x: number; y: number; w: number; h: number }>;
    hiddenWidgets: string[];
  };
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  timezone: string;
  avatarUrl?: string;
  tradingPreferences: TradingPreferences;
  createdAt: Date;
  updatedAt: Date;
};

export const defaultTradingPreferences: TradingPreferences = {
  defaultView: 'dashboard',
  theme: 'dark',
  metricsRefreshInterval: 30,
  showRealTimeAlerts: true,
  alertThresholds: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    ttfb: 800,
    inp: 200,
  },
  riskTolerance: 'moderate',
  tradingHours: {
    start: '09:30',
    end: '16:00',
    timezone: 'America/New_York',
  },
  emailNotifications: {
    performanceAlerts: true,
    dailySummary: true,
    weeklyReport: true,
    systemUpdates: true,
  },
  dashboardLayout: {
    pinnedMetrics: ['lcp', 'fid', 'cls'],
    widgetPositions: {},
    hiddenWidgets: [],
  },
};