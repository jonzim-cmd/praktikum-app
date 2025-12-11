# CLAUDE.md

## Projekt: practical

App zur Verwaltung von Schülerpraktika. Skalierbar auf alle Schularten und Bundesländer.

**Pilot:** Bayerische Wirtschaftsschulen | **Sprache:** Deutsch

---

## STOP – Vor jeder Implementierung

**Bevor du Code schreibst, MUSST du die relevanten Dokumente lesen.**

Ich (Claude) neige dazu, bei neuem Kontext nur oberflächlich zu lesen und dann Annahmen zu machen. Das führt zu generischem Code, der nicht zum Konzept passt. Die Konzept-Dokumente sind die Wahrheit – nicht meine Annahmen.

### Pflicht-Lesereihenfolge bei neuem Chat

1. **`docs/KONZEPT-V2.md`** – Executive Summary, Dokumentenverzeichnis
2. **`docs/architektur/MODULE.md`** – Hauptreferenz für alle Features (lies komplett!)

### Vor Feature-Implementierung

| Wenn ich baue... | Muss ich lesen... |
|------------------|-------------------|
| Schüler-UI/Flow | `FLOW-SCHUELER.md` + `ENTSCHEIDUNGEN-SCHUELER.md` |
| Lehrkraft-UI/Flow | `FLOW-LEHRKRAFT.md` + `ENTSCHEIDUNGEN-LEHRKRAFT.md` |
| Betrieb-UI/Flow | `FLOW-BETRIEB.md` + `ENTSCHEIDUNGEN-BETRIEB.md` |
| Admin-UI/Flow | `FLOW-ADMIN.md` + `ENTSCHEIDUNGEN-ADMIN.md` |
| Datenbank/Schema | `architektur/KERN-ENTITAETEN.md` + `architektur/MODULE.md` |
| Auth/Login | `ENTSCHEIDUNGEN-DATENSCHUTZ.md` + `ENTSCHEIDUNGEN-BETRIEB.md` |
| Neues Modul | `architektur/MODULE.md` (Abschnitt zum Modul) + `architektur/EVENTS.md` |
| Profil/Config | `architektur/PROFILE.md` + `SKALIERBARKEIT.md` |
| UI-Komponenten | `DESIGN.md` |

### Checkliste vor dem Coden

- [ ] Habe ich das relevante FLOW-Dokument gelesen?
- [ ] Habe ich das relevante ENTSCHEIDUNGEN-Dokument gelesen?
- [ ] Habe ich in MODULE.md den Abschnitt zum Feature gelesen?
- [ ] Kenne ich die Parameter, Events und Entitäten?
- [ ] Habe ich KEINE Annahmen gemacht, die nicht in den Docs stehen?

---

## Architektur-Kurzreferenz

```
PROFILE (WS Bayern, MS Bayern)     → Modul-Kombination + Parameter
    ↓
MODULE (~40 Features, an/aus)      → docs/architektur/MODULE.md
    ↓
EVENTS (Kommunikation)             → docs/architektur/EVENTS.md
    ↓
KERN-ENTITÄTEN (immer da)          → docs/architektur/KERN-ENTITAETEN.md
```
---

## Kernregeln

1. **Keine hardcodierten Werte** – Alles kommt aus Profil/Config
2. **Datenschutz eingebaut** – Atteste auto-löschen, Datenminimierung
3. **Module sind optional** – Immer `isModuleActive()` prüfen
4. **Events für Kommunikation** – Module rufen sich nicht direkt auf

---

## Tech-Stack

| Bereich | Technologie |
|---------|-------------|
| Framework | Next.js 15 (App Router, RSC) |
| DB | PostgreSQL + Drizzle |
| Auth | Better Auth (Passkeys, OIDC-ready) |
| Styling | Tailwind v4 + shadcn/ui |
| Design | Violett #694AFF, "Quiet Confidence" |

Details: `docs/TECH-STACK.md`

---

## Dokumentenstruktur

```
docs/
├── KONZEPT-V2.md              ← START HIER (Executive Summary)
├── FLOW-*.md                  ← Komplette Flows als Diagramme
├── ENTSCHEIDUNGEN-*.md        ← Alle Entscheidungen pro Rolle
├── architektur/
│   ├── MODULE.md              ← HAUPTREFERENZ für Features
│   ├── KERN-ENTITAETEN.md     ← Datenmodell
│   ├── EVENTS.md              ← Event-Katalog
│   └── PROFILE.md             ← Schulart-Profile
├── TECH-STACK.md              ← Technologie
├── DESIGN.md                  ← Design-System
└── SKALIERBARKEIT.md          ← Konfigurierbarkeit
```

---

## Rollen-Farben (nur für Badges/Avatare)

| Rolle | Farbe | Hex |
|-------|-------|-----|
| Schüler | Indigo | #6366F1 |
| Lehrkraft | Emerald | #10B981 |
| Betrieb | Amber | #F59E0B |

App-Primärfarbe: **Violett #694AFF**

---

## Häufige Fehler vermeiden

| Fehler | Richtig |
|--------|---------|
| Modul-Code ohne Check | `if (await isModuleActive('grading'))` |
| Direkte Modul-Aufrufe | Events emittieren, andere Module subscriben |
| Annahmen über Flow | Erst FLOW-*.md lesen, dann implementieren |
| Generische UI | DESIGN.md lesen, "Quiet Confidence" Aesthetic |

---

## Bei Unklarheit

1. **Erst in Docs suchen** – Die Antwort steht meist schon da
2. **KONZEPT-V2.md** hat Dokumentenverzeichnis mit Beschreibungen
3. **MODULE.md** ist die Hauptreferenz für fast alles
4. **Fragen statt raten** – Lieber nachfragen als falsch implementieren

---

## AI Code Quality Guidelines

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
- Use design tokens from `src/styles/design-tokens.ts`, not hardcoded pixel values
- Prefer Tailwind classes over inline styles
- Avoid `!important` unless absolutely necessary

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

## Remove AI code slop argument-hint:

Check the diff against main, and remove all AI generated slop introduced in this branch.

This includes:
- Extra comments that a human wouldn't add or is inconsistent with the rest of the file
- Extra defensive checks or try/catch blocks that are abnormal for that area of the codebase (especially if called by trusted / validated codepaths)
- Casts to any to get around type issues
- Variables that are only used a single time right after declaration, prefer inlining the rhs
- Any other style that is inconsistent with the file

Report at the end with only a 1-3 sentence summary of what you changed