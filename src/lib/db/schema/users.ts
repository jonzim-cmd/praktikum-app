import { pgTable, uuid, varchar, timestamp, boolean, pgEnum, text } from 'drizzle-orm/pg-core';
import { schools } from './schools';

export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'school_admin',
  'teacher',
  'student',
  'company_user',
]);

export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'company_user';

/**
 * Users table - compatible with Better Auth
 *
 * Better Auth required fields: id, name, email, emailVerified, image, createdAt, updatedAt
 * Custom fields: schoolId, role, firstName, lastName, username, displayUsername, isActive, lastLoginAt
 */
export const users = pgTable('users', {
  // Better Auth required fields
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: boolean('email_verified').default(false),
  image: varchar('image', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Username plugin fields
  username: varchar('username', { length: 100 }).unique(),
  displayUsername: varchar('display_username', { length: 100 }),

  // Custom fields for our app
  schoolId: uuid('school_id').references(() => schools.id),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: userRoleEnum('role').notNull().default('student'),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
});

/**
 * Sessions table - compatible with Better Auth
 * Note: Better Auth generates string IDs, not UUIDs
 */
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Accounts table - Better Auth uses this for OAuth providers and credentials
 */
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: varchar('scope', { length: 500 }),
  idToken: text('id_token'),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
 * Verifications table - Better Auth uses this for email verification, password reset, etc.
 */
export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
