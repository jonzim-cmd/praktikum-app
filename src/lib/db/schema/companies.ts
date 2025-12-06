import { pgTable, uuid, varchar, timestamp, boolean, integer, decimal, text } from 'drizzle-orm/pg-core';
import { schools } from './schools';
import { users } from './users';

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').notNull().references(() => schools.id),

  name: varchar('name', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 100 }),

  street: varchar('street', { length: 255 }),
  zip: varchar('zip', { length: 10 }),
  city: varchar('city', { length: 100 }),

  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),

  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),

  inPool: boolean('in_pool').default(false),
  poolOptInAt: timestamp('pool_opt_in_at'),

  totalInternships: integer('total_internships').default(0),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const companyContacts = pgTable('company_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  userId: uuid('user_id').references(() => users.id),

  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  position: varchar('position', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),

  isPrimary: boolean('is_primary').default(false),

  createdAt: timestamp('created_at').defaultNow(),
});

export const companyReviews = pgTable('company_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  internshipId: uuid('internship_id').notNull(),

  wouldRecommend: boolean('would_recommend'),
  supervisionRating: integer('supervision_rating'),
  learningRating: integer('learning_rating'),
  atmosphereRating: integer('atmosphere_rating'),
  comment: text('comment'),

  createdAt: timestamp('created_at').defaultNow(),
});
