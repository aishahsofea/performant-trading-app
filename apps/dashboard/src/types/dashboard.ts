// Dashboard widget types
export type WidgetType = 
  | 'performance-chart'
  | 'portfolio-summary' 
  | 'watchlist'
  | 'recent-trades'
  | 'price-alerts'
  | 'market-overview'
  | 'news-feed'
  | 'quick-stats'
  | 'trading-tools'
  | 'solar-system';

export type WidgetPosition = {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number; // width in grid units
  h: number; // height in grid units
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  isDraggable?: boolean;
  isResizable?: boolean;
};

export type GridSettings = {
  columns: number;
  rowHeight: number;
  margin: [number, number]; // [x, y] margins
  containerPadding: [number, number]; // [x, y] padding
  breakpoints: {
    lg: number;
    md: number;
    sm: number;
    xs: number;
  };
  cols: {
    lg: number;
    md: number;
    sm: number;
    xs: number;
  };
};

export type LayoutConfiguration = {
  widgets: WidgetPosition[];
  gridSettings: GridSettings;
  metadata: {
    name: string;
    description?: string;
    category: 'trading' | 'analysis' | 'portfolio' | 'custom';
    tags: string[];
  };
};

export type DashboardTheme = 'light' | 'dark' | 'auto';

export type UserDashboardPreferences = {
  currentLayoutId?: string;
  autoSave: boolean;
  theme: DashboardTheme;
  compactMode: boolean;
  showTips: boolean;
  animationsEnabled: boolean;
  gridSnap: boolean;
  widgetBorders: boolean;
  preferences: Record<string, any>;
};

// Predefined layout templates
export type LayoutTemplate = {
  id: string;
  name: string;
  description: string;
  category: 'trading' | 'analysis' | 'portfolio' | 'custom';
  preview: string; // URL to preview image
  isDefault: boolean;
  layout: LayoutConfiguration;
};

// Layout save/load operations
export type SaveLayoutRequest = {
  name: string;
  description?: string;
  layout: LayoutConfiguration;
  isDefault?: boolean;
};

export type LayoutResponse = {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  layout: LayoutConfiguration;
  createdAt: string;
  updatedAt: string;
};