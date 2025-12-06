import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { schools } from './schools';

export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  schoolId: uuid('school_id').notNull().references(() => schools.id),

  classYear: varchar('class_year', { length: 20 }),
  schoolYear: varchar('school_year', { length: 10 }),

  primaryTeacherId: uuid('primary_teacher_id').references(() => users.id),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const studentTeachers = pgTable('student_teachers', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id),
  teacherId: uuid('teacher_id').notNull().references(() => users.id),
  role: varchar('role', { length: 50 }),
  assignedAt: timestamp('assigned_at').defaultNow(),
});
