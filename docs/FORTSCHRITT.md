# Entwicklungsfortschritt

## Aktueller Stand

**Datum:** 2025-12-06
**Phase:** Projekt-Setup & Grundstruktur

---

## Abgeschlossene Schritte

### 1. Projekt initialisiert
- [x] Next.js 16 mit App Router
- [x] TypeScript konfiguriert
- [x] Dependencies installiert

### 2. Design System (Tailwind v4)
- [x] Custom Theme mit @theme in globals.css
- [x] Warme Farbpalette (Teal + Terrakotta)
- [x] Light/Dark Mode Support vorbereitet
- [x] Design Tokens in TypeScript-Dateien (für Referenz)
- [x] Custom Fonts (Plus Jakarta Sans, Source Sans 3, JetBrains Mono)

### 3. Datenbank-Schema (Drizzle ORM)
- [x] Alle Tabellen aus ARCHITEKTUR.md implementiert:
  - `schools` (Mandanten)
  - `users` + `sessions`
  - `students` + `studentTeachers`
  - `companies` + `companyContacts` + `companyReviews`
  - `internships` + `internshipBlocks` + `timeEntries` + `sickLeaves` + `reports`
  - `milestones`
  - `assessments`
  - `documents`
  - `notifications` + `pushSubscriptions`
  - `auditLogs`
- [x] Drizzle Config erstellt

### 4. Better Auth Setup
- [x] Better Auth installiert (Lucia Auth entfernt - war deprecated)
- [x] Auth-Konfiguration in `src/lib/auth/index.ts`
- [x] Client-Setup in `src/lib/auth/client.ts`
- [x] Username-Plugin für Login ohne E-Mail
- [x] API-Route unter `/api/auth/[...all]`
- [x] Drizzle-Schema erweitert (accounts, verifications Tabellen)
- [x] Helper für Platzhalter-E-Mails in `src/lib/auth/helpers.ts`

### 5. Basis-UI-Komponenten
- [x] Button (mit Varianten: default, accent, secondary, outline, ghost, destructive)
- [x] Card (mit Header, Title, Description, Content, Footer)
- [x] Input (mit Error-State)
- [x] Label (mit required Marker)
- [x] StatusBadge (Ampel-System: success, warning, error, info, neutral)

---

### 6. Layout & Navigation
- [x] Dashboard-Shell mit Sidebar
- [x] Mobile Navigation (Bottom-Tab-Bar)
- [x] Theme Toggle (Dark Mode)
- [x] User-Menü mit Dropdown

---

### 7. Login-Flow
- [x] Login-Seite (`/login`) mit Username/Passwort
- [x] Auth-Actions (signIn, signOut via Better Auth)
- [x] Protected Routes Middleware (redirect zu /login)
- [x] Redirect nach Login (mit ?redirect Parameter)

---

## Nächste Schritte

### 8. Erste Feature-Implementierung
- [ ] Schule anlegen (Admin)
- [ ] Benutzer anlegen (Admin)
- [ ] Dashboard-Startseite pro Rolle

---

## Lokale Entwicklung starten

```bash
# PostgreSQL starten
docker-compose up -d

# .env.local erstellen (Kopie von .env.example)
cp .env.example .env.local

# Datenbank-Migrationen erstellen
npm run db:generate

# Migrationen ausführen
npm run db:migrate

# Dev-Server starten
npm run dev
```

---

## Zu testen

1. **Build funktioniert:**
   ```bash
   npm run build
   ```

2. **Dev-Server läuft:**
   ```bash
   npm run dev
   ```
   → Öffne http://localhost:3000

3. **UI-Komponenten:**
   - Startseite zeigt Design System Demo
   - Button-Varianten prüfen
   - Status-Badges (Ampel-Farben)
   - Formular-Elemente

---

## Projektstruktur

```
src/
├── app/
│   ├── layout.tsx           # Root Layout mit Fonts + ThemeProvider
│   ├── page.tsx             # Design System Demo
│   ├── (auth)/              # Auth-Bereich (öffentlich)
│   │   ├── layout.tsx
│   │   └── login/
│   │       └── page.tsx     # Login-Seite
│   └── (dashboard)/         # Dashboard-Bereich (geschützt)
│       ├── layout.tsx       # Dashboard-Layout mit Shell + Session
│       └── lehrer/
│           └── page.tsx     # Lehrkraft-Dashboard Demo
├── middleware.ts            # Protected Routes → /login Redirect
├── components/
│   ├── ui/
│   │   ├── button.tsx       # Button mit Varianten
│   │   ├── card.tsx         # Card-Komponenten
│   │   ├── input.tsx        # Input mit Error
│   │   ├── label.tsx        # Label mit required
│   │   ├── status-badge.tsx # Ampel-System
│   │   └── index.ts         # Exports
│   └── layout/
│       ├── dashboard-shell.tsx # Dashboard-Shell
│       ├── sidebar.tsx         # Desktop-Sidebar
│       ├── mobile-nav.tsx      # Mobile Bottom Navigation
│       ├── user-menu.tsx       # User-Menü Dropdown
│       └── index.ts            # Exports
├── lib/
│   ├── auth/
│   │   ├── index.ts         # Better Auth Config
│   │   ├── client.ts        # Client-Side Auth
│   │   └── helpers.ts       # Username/E-Mail Helpers
│   ├── db/
│   │   ├── index.ts         # Drizzle Client
│   │   └── schema/          # Alle Tabellen
│   └── utils/
│       └── cn.ts            # clsx + twMerge
└── styles/
    ├── globals.css          # Tailwind v4 @theme
    ├── tokens/              # TypeScript Token-Definitionen
    └── fonts/               # Font-Setup
```

---

## Bekannte Issues

- Dark Mode Toggle noch nicht implementiert (CSS-Variablen sind vorbereitet)
- Passkey-Plugin (Face ID/Touch ID) noch nicht aktiviert (kann später hinzugefügt werden)

---

## Architektur-Entscheidungen

| Entscheidung | Begründung |
|--------------|------------|
| Tailwind v4 | Neueste Version, @theme Syntax in globals.css, keine tailwind.config.ts nötig |
| Drizzle ORM | Type-safe, performant, nah an SQL |
| Better Auth | Aktiv gepflegt, Username-Login, Passkeys (Face ID) als Plugin |
| Next.js 16 | App Router, Server Actions, beste DX |
| class-variance-authority | Typsichere Komponenten-Varianten |
