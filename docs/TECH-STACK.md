# Tech-Stack

> Technologie-Entscheidungen für practical.
> Validiert gegen die modulare Architektur (MODULE.md, EVENTS.md, KERN-ENTITAETEN.md).

---

## Übersicht

| Bereich | Technologie | Begründung |
|---------|-------------|------------|
| **Framework** | Next.js 15 (App Router) | Full-Stack, Server Components, SSR/RSC |
| **Sprache** | TypeScript | Type-Safety, bessere Wartbarkeit |
| **Datenbank** | PostgreSQL | Relational, bewährt, JSON-Support für Module-Settings |
| **ORM** | Drizzle | Type-safe, performant, nah an SQL |
| **Auth** | Better Auth | OIDC-ready für VIDIS, Passkeys, aktiv gepflegt |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Design-Tokens, schnelle Entwicklung |
| **PDF** | @react-pdf/renderer | React-basiert, kein Headless Browser nötig |
| **E-Mail** | Resend (Default) + SMTP (Optional) | Deutscher AVV verfügbar, Schul-SMTP möglich |
| **Push** | Web Push API | Self-hosted, keine externe Abhängigkeit |
| **Karten** | Leaflet + OpenStreetMap | Kostenlos, DSGVO-konform |
| **Geocoding** | Photon (self-hosted) | OpenStreetMap-basiert, kein Google |
| **Analytics** | Plausible (self-hosted) | Cookie-frei, DSGVO-konform |
| **Hosting** | Hetzner VPS + Coolify | DSGVO, deutscher Anbieter |

---

## Framework: Next.js 15

### Begründung

- **Server Components (RSC):** Reduziert Client-Bundle, ideal für Mobile-First
- **App Router:** Moderne Routing-Architektur mit Layouts
- **Server Actions:** Direkte DB-Zugriffe ohne API-Boilerplate
- **Streaming:** Progressive Rendering für bessere UX
- **Edge-ready:** Falls später Skalierung nötig

### Architektur-Fit

| Anforderung | Lösung |
|-------------|--------|
| Multi-Tenant (School) | Middleware prüft `school_id` aus Session |
| Modul-Aktivierung | Server Components laden bedingt |
| Event-System | Server Actions triggern Events |
| Mobile-First | RSC minimiert JS, PWA-Support |

---

## Datenbank: PostgreSQL + Drizzle

### Begründung

- **PostgreSQL:** Bewährt, JSON für `settings`-Felder, volle Relationalität
- **Drizzle:** Type-safe ohne Code-Generation, nah an SQL, schnell

### Schema-Mapping zu KERN-ENTITAETEN.md

| Entität | Tabelle | Besonderheiten |
|---------|---------|----------------|
| School | `schools` | `settings: jsonb` für Profil-Überschreibungen |
| Class | `classes` | FK zu School |
| Student | `students` | FK zu Class, School |
| Teacher | `teachers` | `role: enum`, `grading_role: enum` |
| TeacherAssignment | `teacher_assignments` | Soft-Link zu Class ODER Student |
| Business | `businesses` | `*_normalized` für Duplikaterkennung |
| Period | `periods` | `class_ids: uuid[]` |
| Placement | `placements` | Zentrale Entität |
| Attendance | `attendances` | Ein Eintrag pro Tag pro Placement |

### JSON-Felder

Profile und Module nutzen `jsonb` für flexible Konfiguration:

```typescript
// schools.settings
interface SchoolSettings {
  core: {
    required_days: number;
    min_businesses: number;
    // ...
  };
  modules: {
    application_tracking: ModuleConfig;
    commitment: ModuleConfig;
    // ...
  };
}
```

### Modul-Tabellen

Module haben eigene Tabellen, die nur existieren wenn Modul aktiv:

| Modul | Tabellen |
|-------|----------|
| application_tracking | `applications` |
| commitment | `commitments` |
| contract | `contracts`, `contract_signatures` |
| sick_reporting | `sick_reports` |
| catch_up | `catch_up_records` |
| reflection_tasks | `tasks`, `task_submissions` |
| grading | `grades`, `grade_components` |
| visit_scheduling | `visits`, `visit_slots` |
| business_feedback | `business_feedbacks` |
| teacher_feedback | `teacher_feedbacks` |

---

## Auth: Better Auth

### Begründung

- **Lucia ist deprecated** – Better Auth ist der aktiv gepflegte Nachfolger
- **OIDC-Support:** Für spätere VIDIS/ByCS-Anbindung vorbereitet
- **Passkeys:** WebAuthn für Betriebe (1-Klick-Login)
- **Username-Login:** Ohne E-Mail-Pflicht möglich

### Auth-Strategie pro Rolle

Aus `ENTSCHEIDUNGEN-DATENSCHUTZ.md`:

| Rolle | V1 Auth | V2 Auth |
|-------|---------|---------|
| Schüler | Passwort | + VIDIS/ByCS SSO |
| Lehrkraft | Passwort | + VIDIS/ByCS SSO |
| Betrieb | Magic Link + Passkey | (bleibt) |
| Admin | Passwort + 2FA | (bleibt) |

### Implementierung

```typescript
// src/lib/auth/index.ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username, passkey, twoFactor } from 'better-auth/plugins';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  plugins: [
    username(),           // Login ohne E-Mail
    passkey(),            // WebAuthn für Betriebe
    twoFactor(),          // TOTP für Admins
    // oidc() – später für VIDIS
  ],
  // ...
});
```

### Session-Handling

| Rolle | Timeout | Refresh |
|-------|---------|---------|
| Schüler | 24h | Bei Aktivität |
| Lehrkraft | 7 Tage | Bei Aktivität |
| Betrieb | 90 Tage | Bei Login |
| Admin | 24h | Kein Auto-Refresh |

---

## Event-System

### Architektur-Fit zu EVENTS.md

Das Event-System ist zentral für die modulare Architektur. Module kommunizieren über Events, nicht direkte Aufrufe.

### Implementierung

```typescript
// src/lib/events/index.ts
import { EventEmitter } from 'events';

type EventName =
  | 'commitment.submitted'
  | 'commitment.approved'
  | 'contract.approved'
  | 'placement.created'
  // ... alle Events aus EVENTS.md

interface EventPayload {
  'commitment.submitted': {
    commitment_id: string;
    student_id: string;
    business_id: string;
    period_start: Date;
    period_end: Date;
    days_count: number;
  };
  // ... alle Payloads
}

class PraktikumEvents extends EventEmitter {
  emit<K extends EventName>(event: K, payload: EventPayload[K]): boolean;
  on<K extends EventName>(event: K, listener: (payload: EventPayload[K]) => void): this;
}

export const events = new PraktikumEvents();
```

### Event-Handler (Module)

```typescript
// src/modules/approval_window/handler.ts
import { events } from '@/lib/events';

events.on('commitment.submitted', async (payload) => {
  if (!isModuleActive('approval_window')) return;

  // Timer starten
  await scheduleApproval(payload.commitment_id, 36); // hours
});
```

### Alternative: Datenbank-Queue

Für Robustheit (Server-Restart, Retries) später auf DB-Queue umstellen:

```typescript
// events Tabelle
interface EventRecord {
  id: string;
  event_name: string;
  payload: JsonValue;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: Date;
  processed_at: Date | null;
  retry_count: number;
}
```

---

## E-Mail

### Provider-Hierarchie

1. **Schul-SMTP** (falls konfiguriert) – Mails von @schule.de
2. **Resend** (Default) – Deutscher AVV verfügbar

### Templates

E-Mail-Typen aus MODULE.md müssen implementiert werden:

| Typ | Empfänger | Trigger |
|-----|-----------|---------|
| `commitment_received` | LK | commitment.submitted |
| `contract_ready` | Schüler | contract.created |
| `attendance_request` | Betrieb | Freitag 18:00 |
| `sick_notification` | Betrieb | sick.reported |
| `feedback_request` | Betrieb | placement.ending_soon |
| `visit_proposed` | Betrieb | visit.proposed |
| ... | ... | ... |

### Sammel-Mails

```typescript
// Batch-Job: Wöchentliche LK-Zusammenfassung
// Gruppiert ähnliche Events der Woche
// Parameter: teacher_weekly_summary: boolean
```

---

## File Storage

### V1: Lokaler Storage

```
/uploads/
  /{school_id}/
    /contracts/
    /certificates/
    /temp/          # Atteste (auto-delete)
```

### V2: Hetzner Object Storage

S3-kompatibel, DSGVO-konform, günstiger.

### Attest-Handling (DSGVO)

```typescript
// Auto-Delete nach Bestätigung
events.on('sick.certificate_confirmed', async (payload) => {
  await deleteFile(payload.certificate_file_id);
  await updateSickReport(payload.sick_report_id, {
    certificate_confirmed: true,
    certificate_file_id: null, // Datei gelöscht
  });
});
```

---

## PDF-Generierung

### @react-pdf/renderer

- Verträge
- Zertifikate
- Anwesenheits-Nachweise

### Template-System

```typescript
// src/lib/pdf/contract.tsx
export function ContractPDF({ placement, student, business, school }: Props) {
  return (
    <Document>
      <Page>
        <Text>Praktikumsvertrag</Text>
        {/* ... */}
      </Page>
    </Document>
  );
}
```

---

## Push-Benachrichtigungen

### Web Push API

- Self-hosted (kein Firebase)
- VAPID-Keys generieren
- Subscription in DB speichern

### Kategorien (einzeln abschaltbar)

Aus `ENTSCHEIDUNGEN-DATENSCHUTZ.md`:

- Vertragsstatus-Updates
- Erinnerungen
- Krankmeldungen (nur LK)
- Terminbestätigungen
- Bewertungs-Anfragen

---

## Hosting: Hetzner + Coolify

### Server-Empfehlung

| Typ | Specs | Kosten |
|-----|-------|--------|
| **V1 Pilot** | CPX21 (4 vCPU, 8GB RAM) | ~15€/Monat |
| **Skalierung** | CAX31 (8 vCPU ARM, 16GB) | ~25€/Monat |

### Coolify

- Docker-basiert
- Auto-Deploy bei Git Push
- Let's Encrypt SSL
- PostgreSQL als Service
- Backup-Integration

### DSGVO-Konformität

- Hetzner = Deutschland
- AVV mit Hetzner abschließen
- Keine US-Cloud-Dienste

---

## Externe Dienste

### Zu verwenden

| Dienst | Anbieter | Standort | Kosten |
|--------|----------|----------|--------|
| Geocoding | Photon (self-hosted) | DE | Kostenlos |
| Maps | OpenStreetMap | – | Kostenlos |
| Analytics | Plausible (self-hosted) | DE | Kostenlos |
| E-Mail | Resend | US, aber EU-AVV | ~20€/Monat |

### Zu vermeiden

- Google (Analytics, Maps, Fonts, Places)
- AWS, Azure, GCP
- Cloudflare
- US-basierte E-Mail ohne EU-AVV

---

## Security

### Implementierte Maßnahmen

| Maßnahme | Technologie |
|----------|-------------|
| HTTPS | Let's Encrypt via Coolify |
| CSRF | Next.js built-in |
| SQL Injection | Drizzle parameterized queries |
| XSS | React auto-escaping |
| Rate Limiting | Middleware |
| Password Hashing | Argon2 via Better Auth |
| Session Security | HttpOnly, Secure, SameSite |
| Input Validation | Zod schemas |
| Multi-Tenancy | school_id checks in jeder Query |
| Audit Logging | Alle kritischen Aktionen |

---

## Entwicklungs-Workflow

### Lokale Entwicklung

```bash
# 1. Repo klonen
git clone <repo>
cd praktikum-app

# 2. Dependencies
npm install

# 3. PostgreSQL (Docker)
docker-compose up -d

# 4. Environment
cp .env.example .env.local

# 5. DB migrieren
npm run db:push

# 6. Dev Server
npm run dev
```

### Projektstruktur

```
praktikum-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, Passwort-Reset
│   │   ├── (dashboard)/        # Geschützter Bereich
│   │   │   ├── schueler/
│   │   │   ├── lehrer/
│   │   │   ├── betrieb/
│   │   │   └── admin/
│   │   └── api/
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── auth/               # Better Auth
│   │   ├── db/                 # Drizzle
│   │   │   └── schema/         # Tabellen
│   │   ├── events/             # Event-System
│   │   ├── email/
│   │   ├── pdf/
│   │   └── modules/            # Modul-Logik
│   │
│   └── modules/                # Feature-Module
│       ├── application_tracking/
│       ├── commitment/
│       ├── contract/
│       └── ...
│
├── drizzle/                    # Migrations
└── ...
```

---

## Modul-System Implementierung

### Modul aktivieren/deaktivieren

```typescript
// src/lib/modules/index.ts
export async function isModuleActive(
  schoolId: string,
  moduleName: string
): Promise<boolean> {
  const school = await getSchool(schoolId);
  const profile = await getProfile(school.profile_id);

  // Profil-Default
  const profileEnabled = profile.modules[moduleName]?.enabled ?? false;

  // Schul-Override
  const schoolOverride = school.settings?.modules?.[moduleName]?.enabled;

  return schoolOverride ?? profileEnabled;
}
```

### Modul-Parameter

```typescript
// src/lib/modules/parameters.ts
export async function getModuleParams<T>(
  schoolId: string,
  moduleName: string
): Promise<T> {
  const school = await getSchool(schoolId);
  const profile = await getProfile(school.profile_id);

  // Merge: Profil-Defaults + Schul-Overrides
  return {
    ...profile.modules[moduleName],
    ...school.settings?.modules?.[moduleName],
  } as T;
}
```

---

## Validierung gegen Architektur

### Checkliste

| Anforderung | Erfüllt | Wie |
|-------------|---------|-----|
| Multi-Tenant | ✅ | school_id in allen Queries |
| 4 Rollen (Schüler, LK, Betrieb, Admin) | ✅ | Better Auth + Role-Enum |
| ~40 Module aktivierbar | ✅ | jsonb settings + isModuleActive() |
| Event-basierte Kommunikation | ✅ | TypedEventEmitter |
| Profile mit Defaults | ✅ | profile_id → profiles table |
| Schul-Overrides | ✅ | school.settings jsonb |
| DSGVO (Hetzner, kein Google) | ✅ | Nur EU-Dienste |
| Passkeys für Betriebe | ✅ | Better Auth passkey() |
| VIDIS-ready | ✅ | Better Auth OIDC-fähig |
| Mobile-First | ✅ | RSC, PWA |

---

## Offene Entscheidungen

### Zu klären bei Implementierung

| Thema | Optionen | Empfehlung |
|-------|----------|------------|
| State Management | React Query vs. Zustand | React Query (Server-State) |
| Form Handling | React Hook Form vs. Conform | React Hook Form |
| Validation | Zod | Zod (bereits für Drizzle) |
| Testing | Vitest + Playwright | Vitest + Playwright |
| Monorepo? | Nein (V1) | Nein (V1), später optional |

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-10 | Initiale Version basierend auf neuer Architektur |
| 2024-12-10 | Validierung gegen MODULE.md, EVENTS.md, KERN-ENTITAETEN.md |
| 2024-12-10 | Better Auth statt Lucia (deprecated) |
| 2024-12-10 | Event-System für modulare Kommunikation |
