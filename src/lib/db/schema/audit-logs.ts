import { pgTable, uuid, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { schools } from './schools';
import { users } from './users';

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').references(() => schools.id),
  userId: uuid('user_id').references(() => users.id),

  action: varchar('action', { length: 20 }).notNull(),

  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: uuid('entity_id').notNull(),

  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),

  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),

  createdAt: timestamp('created_at').defaultNow(),
});
