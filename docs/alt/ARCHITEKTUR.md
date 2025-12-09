# Architektur – Praktikumsmanagement-App

## Tech-Stack Übersicht

| Bereich | Technologie | Begründung |
|---------|-------------|------------|
| **Framework** | Next.js 14+ (App Router) | Full-Stack, Server Components, gute DX |
| **Sprache** | TypeScript | Type-Safety, bessere Wartbarkeit |
| **Datenbank** | PostgreSQL | Relational, bewährt, JSON-Support |
| **ORM** | Drizzle | Type-safe, performant, nah an SQL |
| **Auth** | Better Auth | Flexibel, Username/Password + Passkeys (Face ID), aktiv gepflegt |
| **Styling** | Tailwind CSS + shadcn/ui | Schnelle Entwicklung, gute Komponenten |
| **PDF** | @react-pdf/renderer | React-basiert, kein Headless Browser nötig |
| **E-Mail** | Resend (Default) + SMTP (Optional) | Flexibel, Schulen können eigenen Server nutzen |
| **Push** | Web Push API | Self-hosted, keine externe Abhängigkeit |
| **Karten** | Leaflet + OpenStreetMap | Kostenlos, DSGVO-freundlich |
| **QR-Code** | qrcode + html5-qrcode | Generierung und Scanning |
| **File Storage** | Lokal (später Hetzner Object Storage) | Einfacher Start, skalierbar |
| **Hosting** | Hetzner VPS + Coolify | DSGVO, deutscher Anbieter, PaaS-Komfort |

---

## Projektstruktur

```
praktikum-app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth-Routen (Login, Logout)
│   │   │   ├── login/
│   │   │   └── passwort-vergessen/
│   │   ├── (dashboard)/          # Geschützter Bereich
│   │   │   ├── schueler/         # Schüler-Dashboard
│   │   │   ├── lehrer/           # Lehrkraft-Dashboard
│   │   │   ├── betrieb/          # Betrieb-Dashboard
│   │   │   └── admin/            # Admin-Bereich
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   ├── praktika/
│   │   │   ├── betriebe/
│   │   │   ├── dokumente/
│   │   │   └── webhooks/
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing/Redirect
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui Komponenten
│   │   ├── forms/                # Formulare (Bewertung, Meilensteine, etc.)
│   │   ├── dashboard/            # Dashboard-spezifische Komponenten
│   │   ├── maps/                 # Karten-Komponenten
│   │   └── shared/               # Geteilte Komponenten
│   │
│   ├── lib/
│   │   ├── auth/                 # Better Auth Setup
│   │   │   ├── index.ts          # Auth-Konfiguration
│   │   │   ├── client.ts         # Client-Side Auth
│   │   │   └── helpers.ts        # Hilfsfunktionen (Username ohne E-Mail)
│   │   ├── db/                   # Drizzle Setup
│   │   │   ├── index.ts          # DB Connection
│   │   │   ├── schema/           # Tabellen-Definitionen
│   │   │   │   ├── users.ts
│   │   │   │   ├── schools.ts
│   │   │   │   ├── students.ts
│   │   │   │   ├── internships.ts
│   │   │   │   ├── companies.ts
│   │   │   │   ├── documents.ts
│   │   │   │   ├── milestones.ts
│   │   │   │   ├── assessments.ts
│   │   │   │   ├── notifications.ts
│   │   │   │   └── audit-logs.ts
│   │   │   └── migrations/       # DB Migrations
│   │   ├── email/                # E-Mail Service
│   │   │   ├── resend.ts
│   │   │   ├── smtp.ts
│   │   │   └── templates/
│   │   ├── pdf/                  # PDF Generierung
│   │   │   ├── vertrag.tsx
│   │   │   └── zertifikat.tsx
│   │   ├── push/                 # Web Push
│   │   ├── storage/              # File Upload/Storage
│   │   └── utils/                # Hilfsfunktionen
│   │
│   ├── hooks/                    # Custom React Hooks
│   ├── types/                    # TypeScript Types
│   └── styles/
│       ├── globals.css
│       └── design-tokens.ts      # Farben, Spacing, etc.
│
├── public/
│   ├── manifest.json             # PWA Manifest
│   └── icons/                    # App Icons
│
├── drizzle/                      # Drizzle Config & Migrations
├── .env.local                    # Umgebungsvariablen (nicht committen!)
├── .env.example                  # Beispiel für Umgebungsvariablen
├── docker-compose.yml            # Lokale Entwicklung (PostgreSQL)
├── Dockerfile                    # Production Build
├── next.config.js
├── tailwind.config.js
├── drizzle.config.ts
├── tsconfig.json
└── package.json
```

---

## Datenbank-Schema (Drizzle)

### Übersicht der Tabellen

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     schools     │────<│      users      │     │   companies     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │               ┌───────┴───────┐               │
        │               │               │               │
        ▼               ▼               ▼               │
┌─────────────────┐ ┌─────────┐ ┌─────────────┐        │
│    students     │ │ teachers│ │company_users│        │
└─────────────────┘ └─────────┘ └─────────────┘        │
        │                                               │
        ▼                                               │
┌─────────────────┐                                     │
│   internships   │─────────────────────────────────────┘
└─────────────────┘
        │
        ├──────────────┬──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌──────────┐ ┌─────────────┐
│   blocks    │ │ milestones  │ │ documents│ │ assessments │
└─────────────┘ └─────────────┘ └──────────┘ └─────────────┘
        │
        ├──────────────┬──────────────┐
        ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│time_entries │ │   reports   │ │ sick_leaves │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Schema-Definitionen

```typescript
// src/lib/db/schema/schools.ts
import { pgTable, uuid, varchar, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';

export const schools = pgTable('schools', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(), // URL-freundlich
  
  // Konfiguration
  config: jsonb('config').$type<SchoolConfig>().default({}),
  
  // Kontakt
  address: varchar('address', { length: 500 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  website: varchar('website', { length: 255 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  
  // E-Mail Konfiguration
  emailProvider: varchar('email_provider', { length: 20 }).default('resend'), // 'resend' | 'smtp'
  smtpConfig: jsonb('smtp_config').$type<SmtpConfig>(),
  
  // Meta
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Typen für JSON-Felder
interface SchoolConfig {
  internshipDays: number;              // 15 oder 20
  requireMinTwoCompanies: boolean;
  modules: {
    expectations: boolean;
    observations: boolean;
    portfolio: boolean;
    grading: boolean;
  };
  notifications: {
    enabled: boolean;
    reminderDaysBefore: number[];      // z.B. [7, 2]
    escalationDaysAfter: number;
  };
  assessmentQuestions: AssessmentQuestion[];
  milestoneTemplates: MilestoneTemplate[];
}
```

```typescript
// src/lib/db/schema/users.ts
import { pgTable, uuid, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'super_admin',    // Plattform-Admin (du)
  'school_admin',   // Schul-Admin
  'teacher',        // Lehrkraft
  'student',        // Schüler
  'company_user',   // Betrieb-Ansprechpartner
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').references(() => schools.id),
  
  // Auth
  username: varchar('username', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),          // Optional
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  
  // Profil
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: userRoleEnum('role').notNull(),
  
  // Status
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  
  // Meta
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Sessions für Lucia Auth
export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at').notNull(),
});
```

```typescript
// src/lib/db/schema/students.ts
export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  schoolId: uuid('school_id').notNull().references(() => schools.id),
  
  // Schüler-Daten
  classYear: varchar('class_year', { length: 20 }),  // z.B. "10a", "11b"
  schoolYear: varchar('school_year', { length: 10 }), // z.B. "2024/25"
  
  // Betreuung
  primaryTeacherId: uuid('primary_teacher_id').references(() => users.id),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Zusätzliche Lehrkräfte pro Schüler (m:n)
export const studentTeachers = pgTable('student_teachers', {
  studentId: uuid('student_id').notNull().references(() => students.id),
  teacherId: uuid('teacher_id').notNull().references(() => users.id),
  role: varchar('role', { length: 50 }), // 'grading', 'substitute', etc.
  assignedAt: timestamp('assigned_at').defaultNow(),
});
```

```typescript
// src/lib/db/schema/companies.ts
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').notNull().references(() => schools.id),
  
  // Stammdaten
  name: varchar('name', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 100 }),
  
  // Adresse
  street: varchar('street', { length: 255 }),
  zip: varchar('zip', { length: 10 }),
  city: varchar('city', { length: 100 }),
  
  // Geo für Karte
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  
  // Kontakt
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  
  // Pool-Status
  inPool: boolean('in_pool').default(false),        // Möchte wieder Praktikanten?
  poolOptInAt: timestamp('pool_opt_in_at'),
  
  // Statistik
  totalInternships: integer('total_internships').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Ansprechpartner bei Betrieben
export const companyContacts = pgTable('company_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  userId: uuid('user_id').references(() => users.id), // Optional Login
  
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  position: varchar('position', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  
  isPrimary: boolean('is_primary').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Interne Bewertungen durch Schüler (Betrieb sieht das nicht)
export const companyReviews = pgTable('company_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  internshipId: uuid('internship_id').notNull().references(() => internships.id),
  
  // Bewertung
  wouldRecommend: boolean('would_recommend'),
  supervisionRating: integer('supervision_rating'),  // 1-5
  learningRating: integer('learning_rating'),        // 1-5
  atmosphereRating: integer('atmosphere_rating'),    // 1-5
  comment: text('comment'),
  
  createdAt: timestamp('created_at').defaultNow(),
});
```

```typescript
// src/lib/db/schema/internships.ts
export const internshipStatusEnum = pgEnum('internship_status', [
  'draft',           // Angelegt, noch nicht aktiv
  'searching',       // Schüler sucht Praktikumsplatz
  'confirmed',       // Praktikumsplatz gefunden
  'in_progress',     // Praktikum läuft
  'completed',       // Erfolgreich abgeschlossen
  'incomplete',      // Abgebrochen / Tage fehlen
]);

export const internships = pgTable('internships', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id),
  schoolId: uuid('school_id').notNull().references(() => schools.id),
  
  // Konfiguration
  requiredDays: integer('required_days').notNull(),  // 15 oder 20
  
  // Status
  status: internshipStatusEnum('status').default('draft'),
  
  // Fortschritt
  completedDays: integer('completed_days').default(0),
  missedDays: integer('missed_days').default(0),      // Krank ohne Nachholen
  
  // Bewertung
  finalGrade: varchar('final_grade', { length: 10 }),
  gradedAt: timestamp('graded_at'),
  gradedBy: uuid('graded_by').references(() => users.id),
  
  // Zertifikat
  certificateGeneratedAt: timestamp('certificate_generated_at'),
  certificateUrl: varchar('certificate_url', { length: 500 }),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Blöcke (ein Praktikum kann mehrere Blöcke in verschiedenen Betrieben haben)
export const internshipBlocks = pgTable('internship_blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  internshipId: uuid('internship_id').notNull().references(() => internships.id),
  companyId: uuid('company_id').notNull().references(() => companies.id),
  contactId: uuid('contact_id').references(() => companyContacts.id),
  
  // Zeitraum
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  plannedDays: integer('planned_days').notNull(),
  
  // Vertrag
  contractStatus: varchar('contract_status', { length: 20 }).default('pending'),
  // 'pending' | 'generated' | 'sent' | 'signed'
  contractUrl: varchar('contract_url', { length: 500 }),
  signedContractUrl: varchar('signed_contract_url', { length: 500 }),
  
  // Lehrkraft-Besuch
  visitScheduledAt: timestamp('visit_scheduled_at'),
  visitCompletedAt: timestamp('visit_completed_at'),
  visitNotes: text('visit_notes'),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Tageseinträge
export const timeEntries = pgTable('time_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  blockId: uuid('block_id').notNull().references(() => internshipBlocks.id),
  
  date: date('date').notNull(),
  
  // Status
  studentConfirmed: boolean('student_confirmed').default(false),
  studentConfirmedAt: timestamp('student_confirmed_at'),
  companyConfirmed: boolean('company_confirmed').default(false),
  companyConfirmedAt: timestamp('company_confirmed_at'),
  
  // Optional: Zeiten
  checkInTime: time('check_in_time'),
  checkOutTime: time('check_out_time'),
  
  // Notizen
  notes: text('notes'),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Krankmeldungen
export const sickLeaves = pgTable('sick_leaves', {
  id: uuid('id').primaryKey().defaultRandom(),
  blockId: uuid('block_id').notNull().references(() => internshipBlocks.id),
  
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  days: integer('days').notNull(),
  
  // Attest
  hasAttest: boolean('has_attest').default(false),
  attestUrl: varchar('attest_url', { length: 500 }),
  attestUploadedAt: timestamp('attest_uploaded_at'),
  
  // Nachholen
  makeUpRequired: boolean('make_up_required').default(true),
  madeUpDays: integer('made_up_days').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Tätigkeitsberichte / Berichtsheft
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  blockId: uuid('block_id').notNull().references(() => internshipBlocks.id),
  
  // Zeitraum (Tag oder Woche)
  reportDate: date('report_date').notNull(),
  reportType: varchar('report_type', { length: 10 }).default('daily'), // 'daily' | 'weekly'
  
  // Inhalt
  content: text('content').notNull(),
  activities: jsonb('activities').$type<string[]>(), // Liste der Tätigkeiten
  
  // Bestätigungen
  companyApproved: boolean('company_approved').default(false),
  companyApprovedAt: timestamp('company_approved_at'),
  teacherReviewed: boolean('teacher_reviewed').default(false),
  teacherComment: text('teacher_comment'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

```typescript
// src/lib/db/schema/milestones.ts
export const milestones = pgTable('milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  internshipId: uuid('internship_id').notNull().references(() => internships.id),
  
  // Meilenstein-Typ
  type: varchar('type', { length: 50 }).notNull(),
  // 'applications_sent', 'internship_found', 'contract_signed', 
  // 'expectations_written', 'portfolio_submitted', etc.
  
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  
  // Deadline
  dueDate: date('due_date'),
  
  // Status
  isCompleted: boolean('is_completed').default(false),
  completedAt: timestamp('completed_at'),
  
  // Verknüpfte Dokumente
  documentIds: jsonb('document_ids').$type<string[]>(),
  
  // Erinnerungen gesendet
  remindersSent: jsonb('reminders_sent').$type<Date[]>().default([]),
  
  createdAt: timestamp('created_at').defaultNow(),
});
```

```typescript
// src/lib/db/schema/assessments.ts
export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  internshipId: uuid('internship_id').notNull().references(() => internships.id),
  blockId: uuid('block_id').references(() => internshipBlocks.id),
  
  // Typ
  assessorType: varchar('assessor_type', { length: 20 }).notNull(),
  // 'company' | 'teacher'
  assessorId: uuid('assessor_id').references(() => users.id),
  
  // Bewertungen (Likert 1-5)
  ratings: jsonb('ratings').$type<Record<string, number>>().notNull(),
  // z.B. { punctuality: 5, reliability: 4, teamwork: 5, ... }
  
  // Freitext
  strengths: text('strengths'),
  improvements: text('improvements'),
  comments: text('comments'),
  
  // Weiterempfehlung
  wouldRecommend: varchar('would_recommend', { length: 20 }),
  // 'yes' | 'rather_yes' | 'rather_no' | 'no'
  
  submittedAt: timestamp('submitted_at').defaultNow(),
});
```

```typescript
// src/lib/db/schema/documents.ts
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').notNull().references(() => schools.id),
  
  // Zuordnung (eines davon gefüllt)
  internshipId: uuid('internship_id').references(() => internships.id),
  blockId: uuid('block_id').references(() => internshipBlocks.id),
  studentId: uuid('student_id').references(() => students.id),
  
  // Dokument-Typ
  type: varchar('type', { length: 50 }).notNull(),
  // 'contract', 'signed_contract', 'attest', 'application', 
  // 'portfolio', 'certificate', 'other'
  
  // Datei
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  storageUrl: varchar('storage_url', { length: 500 }).notNull(),
  
  // Meta
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});
```

```typescript
// src/lib/db/schema/notifications.ts
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  
  // Inhalt
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message'),
  
  // Verknüpfung
  relatedType: varchar('related_type', { length: 50 }),
  relatedId: uuid('related_id'),
  
  // Status
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  
  // Push gesendet?
  pushSentAt: timestamp('push_sent_at'),
  emailSentAt: timestamp('email_sent_at'),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Push Subscriptions
export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  
  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  
  userAgent: varchar('user_agent', { length: 500 }),
  
  createdAt: timestamp('created_at').defaultNow(),
});
```

```typescript
// src/lib/db/schema/audit-logs.ts
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  schoolId: uuid('school_id').references(() => schools.id),
  userId: uuid('user_id').references(() => users.id),
  
  // Aktion
  action: varchar('action', { length: 20 }).notNull(),
  // 'CREATE' | 'UPDATE' | 'DELETE'
  
  // Betroffene Entität
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  
  // Änderungen
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  
  // Meta
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
  
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

## Authentifizierung (Better Auth)

Better Auth wurde gewählt, weil:
- Aktiv gepflegt (Lucia Auth wurde deprecated)
- Username-Login ohne E-Mail-Pflicht möglich
- Passkeys/WebAuthn (Face ID, Touch ID) als Plugin verfügbar
- Drizzle-Adapter eingebaut

### Server-Konfiguration

```typescript
// src/lib/auth/index.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema: {
      ...schema,
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    username({ minUsernameLength: 3, maxUsernameLength: 30 }),
  ],
  user: {
    additionalFields: {
      schoolId: { type: 'string', required: false },
      role: { type: 'string', required: true, defaultValue: 'student' },
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true },
      isActive: { type: 'boolean', defaultValue: true },
    },
  },
});
```

### Client-Konfiguration

```typescript
// src/lib/auth/client.ts
import { createAuthClient } from 'better-auth/react';
import { usernameClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [usernameClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

### API Route

```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
```

### Username ohne E-Mail (Workaround)

Da Better Auth technisch eine E-Mail erfordert, generieren wir Platzhalter-E-Mails:

```typescript
// src/lib/auth/helpers.ts
export function generatePlaceholderEmail(username: string, schoolSlug?: string): string {
  const slug = schoolSlug || 'default';
  return `${username.toLowerCase()}@${slug}.praktikum.intern`;
}

// Verwendung bei Registrierung
const email = generatePlaceholderEmail(username, school.slug);
await authClient.signUp.email({
  email,
  password,
  name: `${firstName} ${lastName}`,
  username,
  firstName,
  lastName,
  role: 'student',
  schoolId: school.id,
});
```

### Passkeys (Face ID / Touch ID) – Später aktivieren

```typescript
// Erweiterung in src/lib/auth/index.ts
import { passkey } from 'better-auth/plugins';

plugins: [
  username({ ... }),
  passkey(),  // Aktiviert WebAuthn
],
```

---

## API-Design

### Konventionen

- RESTful Routes
- JSON Request/Response
- Fehler als `{ error: string, code?: string }`
- Pagination mit `?page=1&limit=20`
- Multi-Tenancy: `schoolId` aus Session, nicht aus URL

### Beispiel-Routen

```
GET    /api/praktika                    # Alle Praktika (gefiltert nach Rolle)
GET    /api/praktika/:id                # Einzelnes Praktikum
POST   /api/praktika                    # Neues Praktikum anlegen
PATCH  /api/praktika/:id                # Praktikum aktualisieren
DELETE /api/praktika/:id                # Praktikum löschen

GET    /api/praktika/:id/blocks         # Alle Blöcke eines Praktikums
POST   /api/praktika/:id/blocks         # Neuen Block anlegen

POST   /api/praktika/:id/time-entries   # Tageseintrag erstellen
PATCH  /api/time-entries/:id/confirm    # Betrieb bestätigt Tag

GET    /api/betriebe                    # Alle Betriebe der Schule
GET    /api/betriebe/:id                # Einzelner Betrieb
POST   /api/betriebe                    # Neuen Betrieb anlegen

POST   /api/dokumente/upload            # Datei hochladen
GET    /api/dokumente/:id/download      # Datei herunterladen

POST   /api/pdf/vertrag/:blockId        # Vertrag generieren
POST   /api/pdf/zertifikat/:id          # Zertifikat generieren

POST   /api/auth/login                  # Login
POST   /api/auth/logout                 # Logout
POST   /api/auth/passwort-reset         # Passwort zurücksetzen
```

---

## E-Mail Service

### Abstraktion für beide Provider

```typescript
// src/lib/email/index.ts
import { sendWithResend } from './resend';
import { sendWithSmtp } from './smtp';
import { db } from '@/lib/db';
import { schools } from '@/lib/db/schema';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(schoolId: string, options: EmailOptions) {
  const school = await db.query.schools.findFirst({
    where: eq(schools.id, schoolId),
  });
  
  if (school?.emailProvider === 'smtp' && school.smtpConfig) {
    return sendWithSmtp(school.smtpConfig, options);
  }
  
  return sendWithResend(options);
}
```

### Templates

```typescript
// src/lib/email/templates/invitation.tsx
export function companyInvitationEmail(params: {
  companyName: string;
  studentName: string;
  loginUrl: string;
}) {
  return `
    <h1>Praktikums-Einladung</h1>
    <p>Sehr geehrte Damen und Herren von ${params.companyName},</p>
    <p>
      ${params.studentName} absolviert bei Ihnen ein Praktikum.
      Über folgenden Link können Sie die Anwesenheit bestätigen und
      am Ende eine Bewertung abgeben:
    </p>
    <a href="${params.loginUrl}">Zur Praktikums-App</a>
  `;
}
```

---

## Deployment (Hetzner + Coolify)

### Server-Setup (einmalig)

```bash
# 1. Hetzner VPS erstellen (CPX21 empfohlen: 4 vCPU, 8GB RAM)
# 2. Coolify installieren
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# 3. Coolify Web-UI öffnen (https://<server-ip>:8000)
# 4. Projekt anlegen, GitHub verbinden
```

### Coolify Konfiguration

```yaml
# In Coolify UI konfigurieren:

# Build
Build Pack: Nixpacks (oder Dockerfile)
Build Command: npm run build
Start Command: npm run start

# Environment Variables
DATABASE_URL: postgresql://...
LUCIA_SECRET: <random-string>
RESEND_API_KEY: <key>
VAPID_PUBLIC_KEY: <key>
VAPID_PRIVATE_KEY: <key>
NEXT_PUBLIC_APP_URL: https://praktikum.example.com

# PostgreSQL
# In Coolify: New Resource → Database → PostgreSQL
# Automatisch provisioniert
```

### Backup-Strategie

```
Coolify bietet:
- Automatische PostgreSQL Backups (täglich)
- Backup-Retention konfigurierbar
- Optional: S3-kompatibles Backup-Ziel (Hetzner Object Storage)

Zusätzlich empfohlen:
- Wöchentlicher Export kritischer Daten als SQL-Dump
- Uploads-Verzeichnis in Backup einschließen
```

---

## PWA & Offline (MVP-Version)

### PWA Manifest

```json
// public/manifest.json
{
  "name": "Praktikumsverwaltung",
  "short_name": "Praktikum",
  "description": "Praktikumsmanagement für Schulen",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker (Basic)

```typescript
// Für MVP: Nur App-Shell cachen, keine Offline-Writes
// Später erweiterbar mit Workbox

// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 50 },
      },
    },
  ],
});

module.exports = withPWA({
  // Next.js config
});
```

---

## Security Checklist

- [ ] HTTPS only (Coolify + Let's Encrypt)
- [ ] CSRF Protection (Next.js built-in)
- [ ] SQL Injection (Drizzle parameterized queries)
- [ ] XSS (React auto-escaping)
- [ ] Rate Limiting (API routes)
- [ ] Password Hashing (Argon2 via Lucia)
- [ ] Session Security (HttpOnly, Secure, SameSite)
- [ ] Input Validation (Zod schemas)
- [ ] File Upload Validation (Typ, Größe)
- [ ] Multi-Tenancy Isolation (schoolId checks)
- [ ] Audit Logging

---

## Entwicklungsworkflow

### Lokale Entwicklung

```bash
# 1. Repo klonen
git clone <repo>
cd praktikum-app

# 2. Dependencies installieren
npm install

# 3. PostgreSQL starten (Docker)
docker-compose up -d

# 4. Environment Variables kopieren
cp .env.example .env.local
# → Variablen anpassen

# 5. Datenbank migrieren
npm run db:migrate

# 6. Dev Server starten
npm run dev
```

### Deployment

```bash
# Push zu main Branch
git push origin main

# Coolify erkennt Push und:
# 1. Baut neues Image
# 2. Führt Migrations aus
# 3. Startet neue Version
# 4. Zero-downtime Deployment
```

---

## Nächste Schritte

1. **Projekt initialisieren** – Next.js Setup mit allen Dependencies
2. **Datenbank-Schema** – Drizzle Schema finalisieren, erste Migration
3. **Auth implementieren** – Login/Logout mit Lucia
4. **Basis-UI** – Layout, Navigation, Dashboard-Shells
5. **Erster Feature-Slice** – z.B. Betriebe anlegen und anzeigen
6. **Iterativ erweitern** – Feature für Feature nach MVP-Checkliste