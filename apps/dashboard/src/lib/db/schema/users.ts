import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Users table (extends NextAuth user data)
export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text(),
  email: text().notNull().unique(),
  emailVerified: timestamp(),
  image: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// User profiles table (additional profile information)
export const userProfiles = pgTable('user_profiles', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bio: text(),
  timezone: text().notNull().default('America/New_York'),
  avatarUrl: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;