import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

// Users table (extends NextAuth user data)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User profiles table (additional profile information)
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bio: text('bio'),
  timezone: text('timezone').notNull().default('America/New_York'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Trading preferences table (simplified with JSON)
export const tradingPreferences = pgTable('trading_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  preferences: jsonb('preferences').notNull().default({
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
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Portfolio settings table (simplified with JSON)
export const portfolioSettings = pgTable('portfolio_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  settings: jsonb('settings').notNull().default({
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
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// NextAuth required tables
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: text('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('session_token').notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type TradingPreference = typeof tradingPreferences.$inferSelect;
export type NewTradingPreference = typeof tradingPreferences.$inferInsert;

export type PortfolioSetting = typeof portfolioSettings.$inferSelect;
export type NewPortfolioSetting = typeof portfolioSettings.$inferInsert;