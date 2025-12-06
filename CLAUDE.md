# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Wichtig: Projektdokumentation lesen

Bevor du mit der Entwicklung beginnst oder größere Änderungen machst, lies die relevanten Dokumente:

| Dokument | Inhalt | Wann lesen |
|----------|--------|------------|
| `docs/ANFORDERUNGEN.md` | Features, Workflows, Business-Regeln, Entscheidungen | Bei neuen Features, bei Unklarheiten über Funktionalität |
| `docs/ARCHITEKTUR.md` | Tech-Stack, DB-Schema, API-Design, Auth, Deployment | Bei technischen Entscheidungen, DB-Änderungen, neuen Endpoints |
| `docs/DESIGN.md` | Design-Tokens, Komponenten-Konventionen, Styling-Regeln | Bei UI-Arbeit, neuen Komponenten, Styling |

**Für kreative UI-Entscheidungen** (Farbwahl, visuelle Richtung, Ästhetik): Siehe `.claude/skills/frontend-design/SKILL.md`

---

## Project Overview

A multi-tenant web application for managing, supervising, and documenting student internships at Bavarian vocational schools (Wirtschaftsschulen). The system supports students, teachers, companies (internship hosts), and administrators.

**Language**: German (UI and business logic)

**Kernprinzip**: Lehrkräfte müssen es lieben (weniger Stress), Betriebe dürfen es nicht hassen (minimaler Aufwand).

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth (username/password, passkeys/Face ID support)
- **Styling**: Tailwind CSS + shadcn/ui
- **PDF**: @react-pdf/renderer
- **Maps**: Leaflet + OpenStreetMap
- **Email**: Resend (default) or SMTP (configurable per school)
- **Push**: Web Push API
- **Hosting**: Hetzner VPS + Coolify

Detaillierte Begründungen und Alternativen: `docs/ARCHITEKTUR.md`

## Commands

```bash
# Development
npm run dev              # Start dev server
docker-compose up -d     # Start PostgreSQL locally

# Database
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes (dev only)
npm run db:studio        # Open Drizzle Studio

# Build & Deploy
npm run build           # Production build
npm run start           # Start production server
```

## Architecture

### Directory Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Login, password reset (public)
│   ├── (dashboard)/    # Protected area by role
│   │   ├── schueler/   # Student dashboard
│   │   ├── lehrer/     # Teacher dashboard
│   │   ├── betrieb/    # Company dashboard
│   │   └── admin/      # Admin area
│   └── api/            # API routes
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Form components
│   ├── dashboard/      # Dashboard-specific
│   └── shared/         # Shared components
├── lib/
│   ├── auth/           # Better Auth setup
│   ├── db/             # Drizzle schema & connection
│   │   └── schema/     # Table definitions
│   ├── email/          # Email service abstraction
│   ├── pdf/            # PDF generation (contracts, certificates)
│   └── utils/          # Helpers
├── hooks/              # Custom React hooks
├── types/              # TypeScript types
└── styles/
    ├── globals.css     # CSS variables, base styles
    └── tokens/         # Design tokens (colors, spacing, etc.)
```

Vollständiges DB-Schema mit allen Tabellen: `docs/ARCHITEKTUR.md` → Abschnitt "Datenbank-Schema"

### User Roles

- `super_admin`: Platform admin
- `school_admin`: School admin
- `teacher`: Teacher (can supervise students, primary + secondary assignments)
- `student`: Student
- `company_user`: Company contact

### Core Data Model

- **School** (mandant): Multi-tenant isolation, configurable settings
- **Student** has one **Internship** (15 or 20 days total)
- **Internship** has multiple **InternshipBlocks** (different companies)
- **InternshipBlock** has **TimeEntries**, **Reports**, **SickLeaves**
- **Company** builds up over time as reusable pool (Betriebe-CRM)
- **Milestones** track progress with configurable deadlines
- **Assessments** store evaluations from companies and teachers

Vollständiges Datenmodell mit allen Feldern: `docs/ARCHITEKTUR.md`

### Multi-Tenancy

All queries must filter by `schoolId` from session. Never expose data across schools.

## Design System

**Vollständige Referenz**: `docs/DESIGN.md`

### Grundregel: Keine hardcodierten Werte

```tsx
// ✅ Richtig
<div className="bg-primary text-primary-foreground p-4">
<p className="text-foreground-muted text-sm">

// ❌ Falsch
<div className="bg-[#3b82f6] p-[14px]">
<p className="text-gray-500">
```

### Color Semantics

- `primary` / `primary-hover` / `primary-foreground`: Main actions
- `background` / `background-subtle` / `background-muted`: Surfaces
- `foreground` / `foreground-muted` / `foreground-subtle`: Text
- `success` / `warning` / `error` / `info`: Status (traffic light system)

### Components

Use shadcn/ui with `cva` for variants. Checklist for new components:
- [ ] Semantic color tokens (nicht `bg-blue-600`)
- [ ] Spacing from scale (`p-4`, nicht `p-[15px]`)
- [ ] Focus states (`focus-visible:ring-...`)
- [ ] Loading/Error/Empty states where applicable
- [ ] Mobile-first responsive
- [ ] TypeScript Props Interface
- [ ] Varianten über `cva` definiert

Vollständige Checkliste und Patterns: `docs/DESIGN.md`

## Key Business Rules

1. **Praktikumstage**: 15 Tage (zweistufig) oder 20 Tage (drei-/vierstufig)
2. **Mindestens 2 Betriebe** erforderlich (konfigurierbar, Override möglich)
3. **Kranktage nachzuholen** außerhalb der Unterrichtszeit
4. **Betrieb-Flow minimal**: Kein Registrierungsformular, QR-Code optional
5. **Lehrkraft-Besuch**: Kartenansicht, Routing zu Maps
6. **Mehrere Lehrkräfte** pro Schüler möglich (primär + Vertretung)
7. **Praktikumszertifikat** automatisch generieren (PDF)
8. **DSGVO-konform**, Hosting in Deutschland

Vollständige Feature-Liste mit Priorisierung: `docs/ANFORDERUNGEN.md`

## API Conventions

- RESTful routes
- JSON request/response
- Errors as `{ error: string, code?: string }`
- Pagination: `?page=1&limit=20`
- Multi-tenancy: schoolId from session, never from URL

API-Routen-Übersicht: `docs/ARCHITEKTUR.md` → Abschnitt "API-Design"

## Code Quality Guidelines

Common issues in AI-generated code to watch for and avoid:

### Accessibility
- Use `<button>` for clickable elements, not `<div onClick>` or `<span onClick>`
- All interactive elements must be keyboard-accessible
- Images need alt text, form inputs need labels

### Modern APIs
- Avoid deprecated React patterns (class components, componentWillMount, etc.)
- Use `fetch` or existing patterns, not `XMLHttpRequest`
- Prefer native array methods over lodash equivalents when built-in suffices

### Component Structure
- Extract repeated JSX into separate components, not inline helper functions (affects React re-render optimization)
- One component per file for non-trivial components
- Keep components focused; split when exceeding ~200 lines

### Styling
- Use design tokens from `src/styles/tokens/`, not hardcoded values
- Prefer Tailwind classes over inline styles
- Avoid `!important` unless absolutely necessary
- See `docs/DESIGN.md` for full styling conventions

### Type Safety
- No `as any` casts to silence TypeScript errors; fix the underlying type issue
- Avoid overly complex generic types that obscure intent
- Use existing type definitions; don't duplicate

### Code Conciseness
- Inline single-use variables: `return calculateTotal(items)` not `const result = calculateTotal(items); return result;`
- Avoid unnecessary wrapper elements (extra divs, fragments)
- Remove console.log statements before committing

### useEffect Discipline
- Don't use useEffect for derived state (compute in render or useMemo)
- Don't use useEffect for event handlers
- Minimize dependencies; question each one

### Error Handling
- Don't add try/catch around code that can't throw or is already error-handled upstream
- Match error handling style of surrounding code
- Avoid defensive null checks for values guaranteed by TypeScript or validation

### Comments
- Don't add obvious comments ("increment counter", "return result")
- Match comment density of existing file
- JSDoc only where it adds value beyond TypeScript types

---

## Skills

Verfügbare Skills in `.claude/skills/`

## Hinweise für Claude

1. **Vor neuen Features**: Prüfe `docs/ANFORDERUNGEN.md` ob das Feature dort beschrieben ist
2. **Vor DB-Änderungen**: Prüfe `docs/ARCHITEKTUR.md` für das bestehende Schema
3. **Vor UI-Arbeit**: Prüfe `docs/DESIGN.md` für Token- und Komponenten-Konventionen
4. **Bei Unsicherheit**: Frage nach, statt Annahmen zu treffen
5. **Sprache**: UI-Texte auf Deutsch, Code/Kommentare auf Englisch

## Description: Remove AI code slop argument-hint:

Check the diff against main, and remove all AI generated slop introduced in this branch.

This includes:
- Extra comments that a human wouldn't add or is inconsistent with the rest of the file
- Extra defensive checks or try/catch blocks that are abnormal for that area of the codebase (especially if called by trusted / validated codepaths)
- Casts to any to get around type issues
- Variables that are only used a single time right after declaration, prefer inlining the rhs
- Any other style that is inconsistent with the file

Report at the end with only a 1-3 sentence summary of what you changed
