import { pgTable, uuid, varchar, timestamp, boolean, integer, date, time, text, pgEnum } from 'drizzle-orm/pg-core';
import { students } from './students';
import { schools } from './schools';
import { users } from './users';
import { companies, companyContacts } from './companies';

export const internshipStatusEnum = pgEnum('internship_status', [
  'draft',
  'searching',
  'confirmed',
  'in_progress',
  'completed',
  'incomplete',
]);

export type InternshipStatus = 'draft' | 'searching' | 'confirmed' | 'in_progress' | 'completed' | 'incomplete';

export const internships = pgTable('internships', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id),
  schoolId: uuid('school_id').notNull().references(() => schools.id),

  requiredDays: integer('required_days').notNull(),

  status: internshipStatusEnum('status').default('draft'),

  completedDays: integer('completed_days').default(0),
  missedDays: integer('missed_days').default(0),

  finalGrade: varchar('final_grade', { length: 10 }),
  gradedAt: timestamp('graded_at'),
  gradedBy: uuid('graded_by').references(() => users.id),

  certificateGeneratedAt: timestamp('certificate_generated_at'),
  certificateUrl: varchar('certificate_url', { length: 500 }),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const internshipBlocks = pgTable('internship_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  internshipId: uuid('internship_id').notNull().references(() => internships.id),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  contactId: uuid('contact_id').references(() => companyContacts.id),

  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  plannedDays: integer('planned_days').notNull(),

  contractStatus: varchar('contract_status', { length: 20 }).default('pending'),
  contractUrl: varchar('contract_url', { length: 500 }),
  signedContractUrl: varchar('signed_contract_url', { length: 500 }),

  visitScheduledAt: timestamp('visit_scheduled_at'),
  visitCompletedAt: timestamp('visit_completed_at'),
  visitNotes: text('visit_notes'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const timeEntries = pgTable('time_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  blockId: uuid('block_id').notNull().references(() => internshipBlocks.id),

  date: date('date').notNull(),

  studentConfirmed: boolean('student_confirmed').default(false),
  studentConfirmedAt: timestamp('student_confirmed_at'),
  companyConfirmed: boolean('company_confirmed').default(false),
  companyConfirmedAt: timestamp('company_confirmed_at'),

  checkInTime: time('check_in_time'),
  checkOutTime: time('check_out_time'),

  notes: text('notes'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const sickLeaves = pgTable('sick_leaves', {
  id: uuid('id').primaryKey().defaultRandom(),
  blockId: uuid('block_id').notNull().references(() => internshipBlocks.id),

  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  days: integer('days').notNull(),

  hasAttest: boolean('has_attest').default(false),
  attestUrl: varchar('attest_url', { length: 500 }),
  attestUploadedAt: timestamp('attest_uploaded_at'),

  makeUpRequired: boolean('make_up_required').default(true),
  madeUpDays: integer('made_up_days').default(0),

  createdAt: timestamp('created_at').defaultNow(),
});

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  blockId: uuid('block_id').notNull().references(() => internshipBlocks.id),

  reportDate: date('report_date').notNull(),
  reportType: varchar('report_type', { length: 10 }).default('daily'),

  content: text('content').notNull(),

  companyApproved: boolean('company_approved').default(false),
  companyApprovedAt: timestamp('company_approved_at'),
  teacherReviewed: boolean('teacher_reviewed').default(false),
  teacherComment: text('teacher_comment'),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
