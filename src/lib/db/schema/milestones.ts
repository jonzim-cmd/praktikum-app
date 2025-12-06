import { pgTable, uuid, varchar, timestamp, boolean, date, text, jsonb } from 'drizzle-orm/pg-core';
import { internships } from './internships';

export const milestones = pgTable('milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  internshipId: uuid('internship_id').notNull().references(() => internships.id),

  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),

  dueDate: date('due_date'),

  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),

  documentIds: jsonb('document_ids').$type<string[]>().default([]),
  remindersSent: jsonb('reminders_sent').$type<string[]>().default([]),

  createdAt: timestamp('created_at').defaultNow(),
});
