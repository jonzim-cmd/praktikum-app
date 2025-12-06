import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { schools } from './schools';
import { internships, internshipBlocks } from './internships';
import { students } from './students';
import { users } from './users';

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').notNull().references(() => schools.id),

  internshipId: uuid('internship_id').references(() => internships.id),
  blockId: uuid('block_id').references(() => internshipBlocks.id),
  studentId: uuid('student_id').references(() => students.id),

  type: varchar('type', { length: 50 }).notNull(),

  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  storageUrl: varchar('storage_url', { length: 500 }).notNull(),

  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});
