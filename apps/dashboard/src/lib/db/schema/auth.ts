import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

// NextAuth required tables
export const accounts = pgTable('accounts', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text().notNull(),
  provider: text().notNull(),
  providerAccountId: text().notNull(),
  refreshToken: text(),
  accessToken: text(),
  expiresAt: text(),
  tokenType: text(),
  scope: text(),
  idToken: text(),
  sessionState: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid().primaryKey().defaultRandom(),
  sessionToken: text().notNull().unique(),
  userId: uuid().references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expires: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text().notNull(),
  token: text().notNull().unique(),
  expires: timestamp().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// Type exports for TypeScript
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;