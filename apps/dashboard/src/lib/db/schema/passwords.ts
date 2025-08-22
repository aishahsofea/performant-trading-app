import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

// Passwords table for credential-based authentication
// Separate from users table to maintain NextAuth compatibility
export const passwords = pgTable('passwords', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  hashedPassword: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// Type exports for TypeScript
export type Password = typeof passwords.$inferSelect;
export type NewPassword = typeof passwords.$inferInsert;