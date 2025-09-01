import { pgTable, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";

// Trading preferences table (simplified with JSON)
export const tradingPreferences = pgTable("trading_preferences", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  preferences: jsonb()
    .notNull()
    .default({
      defaultView: "dashboard",
      theme: "dark",
      metricsRefreshInterval: 30,
      showRealTimeAlerts: true,
      alertThresholds: {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        ttfb: 800,
        inp: 200,
      },
      riskTolerance: "moderate",
      tradingHours: {
        start: "09:30",
        end: "16:00",
        timezone: "America/New_York",
      },
      emailNotifications: {
        performanceAlerts: true,
        dailySummary: true,
        weeklyReport: true,
        systemUpdates: true,
      },
      dashboardLayout: {
        pinnedMetrics: ["lcp", "fid", "cls"],
        widgetPositions: {},
        hiddenWidgets: [],
      },
    }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Portfolio settings table (simplified with JSON)
export const portfolioSettings = pgTable("portfolio_settings", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  settings: jsonb()
    .notNull()
    .default({
      defaultCurrency: "USD",
      displayMode: "detailed",
      sortBy: "value",
      sortOrder: "desc",
      benchmarkIndex: "SPY",
      performancePeriod: "1Y",
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
        defaultTimeframe: "1M",
        chartType: "line",
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
    }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Type exports for TypeScript
export type TradingPreference = typeof tradingPreferences.$inferSelect;
export type NewTradingPreference = typeof tradingPreferences.$inferInsert;

export type PortfolioSetting = typeof portfolioSettings.$inferSelect;
export type NewPortfolioSetting = typeof portfolioSettings.$inferInsert;
