import { pgTable, uuid, varchar, timestamp, text, jsonb } from 'drizzle-orm/pg-core';
import { internships, internshipBlocks } from './internships';
import { users } from './users';

export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  internshipId: uuid('internship_id').notNull().references(() => internships.id),
  blockId: uuid('block_id').references(() => internshipBlocks.id),

  assessorType: varchar('assessor_type', { length: 20 }).notNull(),
  assessorId: uuid('assessor_id').references(() => users.id),

  ratings: jsonb('ratings').$type<Record<string, number>>().notNull(),

  strengths: text('strengths'),
  improvements: text('improvements'),
  comments: text('comments'),

  wouldRecommend: varchar('would_recommend', { length: 20 }),

  submittedAt: timestamp('submitted_at').defaultNow(),
});
