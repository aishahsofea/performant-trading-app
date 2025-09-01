import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Dashboard layout configurations
export const dashboardLayouts = pgTable("dashboard_layouts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text().notNull(), // e.g., "Default", "Day Trading", "Long-term Analysis"
  isDefault: boolean().default(false).notNull(),
  layout: jsonb().notNull(), // Stores the complete layout configuration
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// User dashboard preferences
export const dashboardPreferences = pgTable("dashboard_preferences", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  currentLayoutId: uuid().references(() => dashboardLayouts.id, {
    onDelete: "set null",
  }),
  autoSave: boolean().default(true).notNull(),
  theme: text().default("dark").notNull(), // 'dark', 'light', 'auto'
  compactMode: boolean().default(false).notNull(),
  showTips: boolean().default(true).notNull(),
  preferences: jsonb().notNull().default("{}"), // Additional user preferences
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Type exports for TypeScript
export type DashboardLayout = typeof dashboardLayouts.$inferSelect;
export type NewDashboardLayout = typeof dashboardLayouts.$inferInsert;

export type DashboardPreferences = typeof dashboardPreferences.$inferSelect;
export type NewDashboardPreferences = typeof dashboardPreferences.$inferInsert;
