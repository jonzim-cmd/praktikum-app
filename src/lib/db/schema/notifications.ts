import { pgTable, uuid, varchar, timestamp, boolean, text } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),

  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),

  relatedType: varchar('related_type', { length: 50 }),
  relatedId: uuid('related_id'),

  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),

  pushSentAt: timestamp('push_sent_at'),
  emailSentAt: timestamp('email_sent_at'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),

  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),

  userAgent: varchar('user_agent', { length: 500 }),

  createdAt: timestamp('created_at').defaultNow(),
});
