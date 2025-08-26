import { pgTable, text, timestamp, uuid, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

// User onboarding progress tracking
export const onboardingProgress = pgTable('onboarding_progress', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  currentStepId: text(),
  completedSteps: jsonb().notNull().default('[]'), // Array of step IDs
  skippedSteps: jsonb().notNull().default('[]'), // Array of skipped step IDs
  completedTours: jsonb().notNull().default('[]'), // Array of completed tour IDs
  progress: integer().default(0).notNull(), // 0-100 percentage
  isComplete: boolean().default(false).notNull(),
  showTooltips: boolean().default(true).notNull(),
  tourSpeed: text().default('normal').notNull(), // 'slow', 'normal', 'fast'
  preferences: jsonb().notNull().default('{}'), // Additional onboarding preferences
  startedAt: timestamp().defaultNow().notNull(),
  completedAt: timestamp(),
  lastActiveAt: timestamp().defaultNow().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Onboarding steps configuration (could be used for admin management)
export const onboardingSteps = pgTable('onboarding_steps', {
  id: uuid().primaryKey().defaultRandom(),
  stepId: text().notNull().unique(), // e.g., 'welcome', 'profile-setup'
  title: text().notNull(),
  description: text().notNull(),
  type: text().notNull(), // 'welcome', 'profile-setup', etc.
  component: text(), // React component name
  isRequired: boolean().default(false).notNull(),
  estimatedTime: integer().default(5).notNull(), // minutes
  sortOrder: integer().notNull(),
  dependencies: jsonb().notNull().default('[]'), // Array of step IDs that must be completed first
  isActive: boolean().default(true).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Guided tours configuration
export const guidedTours = pgTable('guided_tours', {
  id: uuid().primaryKey().defaultRandom(),
  tourId: text().notNull().unique(), // e.g., 'dashboard-basics', 'performance-monitoring'
  name: text().notNull(),
  description: text().notNull(),
  category: text().notNull(), // 'dashboard', 'trading', 'performance', 'profile'
  steps: jsonb().notNull(), // Array of tour steps
  isRequired: boolean().default(false).notNull(),
  prerequisites: jsonb().notNull().default('[]'), // Array of required tour IDs
  estimatedTime: integer().default(10).notNull(), // minutes
  sortOrder: integer().notNull(),
  isActive: boolean().default(true).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Type exports for TypeScript
export type OnboardingProgress = typeof onboardingProgress.$inferSelect;
export type NewOnboardingProgress = typeof onboardingProgress.$inferInsert;

export type OnboardingStep = typeof onboardingSteps.$inferSelect;
export type NewOnboardingStep = typeof onboardingSteps.$inferInsert;

export type GuidedTour = typeof guidedTours.$inferSelect;
export type NewGuidedTour = typeof guidedTours.$inferInsert;