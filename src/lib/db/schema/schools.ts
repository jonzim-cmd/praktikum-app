import { pgTable, uuid, varchar, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';

export interface SchoolConfig {
  internshipDays: number;
  requireMinTwoCompanies: boolean;
  modules: {
    expectations: boolean;
    observations: boolean;
    portfolio: boolean;
    grading: boolean;
  };
  notifications: {
    enabled: boolean;
    reminderDaysBefore: number[];
    escalationDaysAfter: number;
  };
  assessmentQuestions?: AssessmentQuestion[];
  milestoneTemplates?: MilestoneTemplate[];
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  type: 'likert' | 'text' | 'boolean';
  required: boolean;
}

export interface MilestoneTemplate {
  id: string;
  type: string;
  title: string;
  description?: string;
  phase: 'preparation' | 'execution' | 'followup';
  defaultDaysOffset: number;
  required: boolean;
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export const schools = pgTable('schools', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),

  config: jsonb('config').$type<SchoolConfig>().default({
    internshipDays: 15,
    requireMinTwoCompanies: true,
    modules: {
      expectations: true,
      observations: false,
      portfolio: true,
      grading: true,
    },
    notifications: {
      enabled: true,
      reminderDaysBefore: [7, 2],
      escalationDaysAfter: 1,
    },
  }),

  address: varchar('address', { length: 500 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  website: varchar('website', { length: 255 }),
  logoUrl: varchar('logo_url', { length: 500 }),

  emailProvider: varchar('email_provider', { length: 20 }).default('resend'),
  smtpConfig: jsonb('smtp_config').$type<SmtpConfig>(),

  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
