# Design System

> Single Source of Truth für practical.
> Minimalistisch. Funktional. Mit Geschmack.

---

## Ästhetische Richtung

**Konzept: "Quiet Confidence"**

Eine App, die nicht schreit, sondern wirkt. Reduziert auf das Wesentliche, aber mit Präzision in jedem Detail. Der Nutzen steht im Vordergrund – das Design macht ihn zugänglich, nicht ablenkend.

### Kernprinzipien

1. **Klarheit über Dekoration** – Jedes Element hat eine Funktion
2. **Konsistenz über Kreativität** – Vorhersagbar ist besser als überraschend
3. **Raum zum Atmen** – Großzügige Abstände, nicht gedrängt
4. **Subtile Qualität** – Die Details, die man erst beim zweiten Blick bemerkt

### Was diese App NICHT ist

- Keine verspielten Animationen ohne Funktion
- Keine Gradients, Glows, oder "modern UI" Klischees
- Keine generischen Inter/Roboto/System-Fonts
- Kein Purple-Gradient-auf-Weiß "AI-Look"

---

## Farbsystem

### Philosophie

Dunkles Theme mit Violett als distinktive Akzentfarbe. Modern, elegant, professionell – für Schüler ansprechend, für Lehrkräfte seriös.

### Palette

```
┌─────────────────────────────────────────────────────────────────┐
│  NEUTRAL SCALE (Dunkel)                                         │
│  ─────────────────────────────────────────────────────────────  │
│  900  #000000   Tiefster Hintergrund                            │
│  800  #0A0A0A   Cards, elevated surfaces                        │
│  700  #111111   Seiten-Hintergrund                              │
│  600  #1E1E1E   Alternative Hintergründe                        │
│  500  #2A2A2A   Muted backgrounds                               │
│  400  #3D3D3D   Strong borders                                  │
│  300  #6B6B6B   Subtle text                                     │
│  200  #A0A0A0   Muted text                                      │
│  100  #E5E5E5   Secondary text                                  │
│  50   #FFFFFF   Primary text                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PRIMARY: Violett                                               │
│  ─────────────────────────────────────────────────────────────  │
│  light   #8B6FFF   Lighter variant                              │
│  DEFAULT #694AFF   Buttons, Links, Akzente                      │
│  hover   #7B5FFF   Hover-State                                  │
│  dark    #5438CC   Darker variant                               │
│  muted   #694AFF26 Hintergründe mit Akzent (15% opacity)        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  SEMANTIC (Status)                                              │
│  ─────────────────────────────────────────────────────────────  │
│  success  #41DF82   Bestätigung, Erfolg                         │
│  warning  #FF5900   Warnung, Aufmerksamkeit                     │
│  error    #D7003D   Fehler, Kritisch                            │
└─────────────────────────────────────────────────────────────────┘
```

### CSS Custom Properties

```css
/* globals.css – @theme Block (Tailwind v4) */
@theme {
  /* Neutral Scale (Dark) */
  --color-neutral-900: #000000;
  --color-neutral-800: #0A0A0A;
  --color-neutral-700: #111111;
  --color-neutral-600: #1E1E1E;
  --color-neutral-500: #2A2A2A;
  --color-neutral-400: #3D3D3D;
  --color-neutral-300: #6B6B6B;
  --color-neutral-200: #A0A0A0;
  --color-neutral-100: #E5E5E5;
  --color-neutral-50: #FFFFFF;

  /* Primary: Violett */
  --color-primary-light: #8B6FFF;
  --color-primary: #694AFF;
  --color-primary-hover: #7B5FFF;
  --color-primary-dark: #5438CC;
  --color-primary-muted: rgba(105, 74, 255, 0.15);

  /* Semantic */
  --color-success: #41DF82;
  --color-success-muted: rgba(65, 223, 130, 0.15);
  --color-warning: #FF5900;
  --color-warning-muted: rgba(255, 89, 0, 0.15);
  --color-error: #D7003D;
  --color-error-muted: rgba(215, 0, 61, 0.15);

  /* Semantic Tokens */
  --color-background: #1E1E1E;
  --color-surface: #111111;
  --color-surface-elevated: #0A0A0A;
  --color-border: #2A2A2A;
  --color-border-strong: #3D3D3D;
  --color-text: #FFFFFF;
  --color-text-secondary: #A0A0A0;
  --color-text-muted: #6B6B6B;

  /* Focus Ring */
  --color-focus: #694AFF;
}
```

### Farbregeln

| Situation | Farbe | Beispiel |
|-----------|-------|----------|
| Primäre Aktion | `primary` (#694AFF) | "Speichern", "Weiter" |
| Sekundäre Aktion | `surface` + `border` | "Abbrechen", "Zurück" |
| Destruktive Aktion | `error` (#D7003D) | "Löschen", "Entfernen" |
| Erfolg anzeigen | `success` (#41DF82) | "Gespeichert", Checkmarks |
| Warnung anzeigen | `warning` (#FF5900) | "Deadline in 3 Tagen" |
| Fehler anzeigen | `error` (#D7003D) | Validierung, Alerts |
| Alles andere | Neutral Scale | Text, Borders, Backgrounds |

### Violett-Glow (optional)

Für Primary-Buttons im Hover-State kann ein subtiler Glow eingesetzt werden:

```css
--shadow-primary: 0 0 20px 0 rgba(105, 74, 255, 0.3);
```

---

## Typografie

### Philosophie

Zwei Schriften, klar getrennte Rollen. Die Display-Schrift für Headlines – charaktervoll aber lesbar. Die Body-Schrift für alles andere – unauffällig perfekt.

### Schriftarten

```
┌─────────────────────────────────────────────────────────────────┐
│  DISPLAY: "Instrument Sans"                                     │
│  ─────────────────────────────────────────────────────────────  │
│  Verwendung: Headlines, Zahlen, Hervorhebungen                  │
│  Weights: 500 (medium), 600 (semibold), 700 (bold)              │
│  Charakter: Modern, leicht condensed, präzise                   │
│  Fallback: system-ui                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  BODY: "IBM Plex Sans"                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Verwendung: Fließtext, Labels, UI-Elemente                     │
│  Weights: 400 (regular), 500 (medium), 600 (semibold)           │
│  Charakter: Technisch, klar, hervorragende Lesbarkeit           │
│  Fallback: system-ui                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MONO: "IBM Plex Mono"                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Verwendung: Code, IDs, technische Werte                        │
│  Weights: 400, 500                                              │
│  Fallback: monospace                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Schriftgrößen

```css
@theme {
  /* Type Scale (1.25 ratio, base 16px) */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

### Typografie-Regeln

| Element | Font | Size | Weight | Line-Height |
|---------|------|------|--------|-------------|
| Page Title | Display | 2xl-4xl | 600 | tight |
| Section Title | Display | xl-2xl | 600 | tight |
| Card Title | Display | lg | 600 | tight |
| Body Text | Body | base | 400 | relaxed |
| UI Labels | Body | sm | 500 | normal |
| Helper Text | Body | xs-sm | 400 | normal |
| Button Text | Body | sm | 500 | normal |
| Input Text | Body | base | 400 | normal |

### Font Setup (Next.js)

```typescript
// src/styles/fonts/index.ts
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const displayFont = localFont({
  src: './InstrumentSans-Variable.woff2',
  variable: '--font-display',
  display: 'swap',
});

export const bodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const monoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});
```

---

## Spacing

### Philosophie

Großzügiger Raum signalisiert Ruhe und Kontrolle. Komponenten atmen. Nichts ist gedrängt.

### Scale

```css
@theme {
  /* 4px base, powers of 2 for consistency */
  --spacing-0: 0;
  --spacing-1: 0.25rem;    /* 4px */
  --spacing-2: 0.5rem;     /* 8px */
  --spacing-3: 0.75rem;    /* 12px */
  --spacing-4: 1rem;       /* 16px */
  --spacing-5: 1.25rem;    /* 20px */
  --spacing-6: 1.5rem;     /* 24px */
  --spacing-8: 2rem;       /* 32px */
  --spacing-10: 2.5rem;    /* 40px */
  --spacing-12: 3rem;      /* 48px */
  --spacing-16: 4rem;      /* 64px */
  --spacing-20: 5rem;      /* 80px */
  --spacing-24: 6rem;      /* 96px */
}
```

### Spacing-Regeln

| Kontext | Spacing | Verwendung |
|---------|---------|------------|
| Intra-Component | 2-3 | Zwischen Icon und Label |
| Component Padding | 3-4 | Button, Input Padding |
| Card Padding | 5-6 | Innenabstand von Cards |
| Stack Gap | 4-6 | Zwischen Listenelementen |
| Section Gap | 8-12 | Zwischen Sektionen |
| Page Padding | 6-8 | Seitenränder (mobile → desktop) |

---

## Borders & Radii

### Philosophie

Subtile Radien, nicht zu rund. Die App soll präzise wirken, nicht weich.

```css
@theme {
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px - Kleine Elemente */
  --radius-md: 0.375rem;   /* 6px - Inputs, Buttons */
  --radius-lg: 0.5rem;     /* 8px - Cards */
  --radius-xl: 0.75rem;    /* 12px - Modals, große Cards */
  --radius-full: 9999px;   /* Pills, Avatare */

  --border-width: 1px;
}
```

### Radius-Regeln

| Element | Radius |
|---------|--------|
| Buttons | md |
| Inputs | md |
| Cards | lg |
| Modals/Dialogs | xl |
| Badges/Pills | full |
| Avatare | full |
| Tooltips | md |

---

## Schatten

### Philosophie

Schatten nur wo nötig für Tiefe. Subtil, nicht dramatisch.

```css
@theme {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  /* Dark Mode: Stärker */
  --shadow-sm-dark: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md-dark: 0 4px 6px -1px rgb(0 0 0 / 0.4);
  --shadow-lg-dark: 0 10px 15px -3px rgb(0 0 0 / 0.5);
}
```

### Schatten-Regeln

| Element | Schatten |
|---------|----------|
| Buttons (resting) | none |
| Buttons (hover) | sm |
| Cards | sm |
| Dropdowns | lg |
| Modals | xl |
| Tooltips | md |

---

## Animation & Transitions

### Philosophie

Bewegung unterstützt das Verständnis, nicht die Aufmerksamkeit. Schnell, präzise, unsichtbar wenn richtig gemacht.

```css
@theme {
  /* Durations */
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-normal: 150ms;
  --duration-slow: 200ms;

  /* Easings */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Transition-Regeln

| Aktion | Duration | Easing |
|--------|----------|--------|
| Hover (color, bg) | fast | default |
| Focus | instant | – |
| Modal open | normal | out |
| Modal close | fast | in |
| Dropdown open | fast | out |
| Toast appear | normal | bounce |
| Toast dismiss | fast | in |

### Was NICHT animiert wird

- Text-Änderungen
- Layout-Shifts (außer bewusst orchestriert)
- Individuelle Listen-Items (außer Stagger bei Page-Load)
- Scrolling (native bleibt)

---

## Komponenten

### Button

```tsx
// Varianten
<Button variant="primary">Speichern</Button>      // bg-primary, text-white
<Button variant="secondary">Abbrechen</Button>    // bg-surface-elevated, border
<Button variant="ghost">Mehr</Button>             // transparent, hover:bg-surface
<Button variant="destructive">Löschen</Button>    // bg-error, text-white

// Größen
<Button size="sm">Klein</Button>                  // h-8, px-3, text-sm
<Button size="md">Normal</Button>                 // h-10, px-4, text-sm
<Button size="lg">Groß</Button>                   // h-12, px-6, text-base
```

### Input

```tsx
<Input
  label="E-Mail"
  placeholder="name@example.com"
  error="Bitte gültige E-Mail eingeben"
/>

// States:
// - Default: border-border, bg-surface
// - Focus: border-primary, ring-1 ring-primary/20
// - Error: border-error, text-error (helper)
// - Disabled: opacity-50, cursor-not-allowed
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Titel</CardTitle>                  // font-display, text-lg
    <CardDescription>Beschreibung</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>

// Styling: bg-surface, border-border, rounded-lg, p-6
```

### Badge / Status

```tsx
// Ampel-System
<Badge status="success">Abgeschlossen</Badge>     // bg-success/10, text-success
<Badge status="warning">Ausstehend</Badge>        // bg-warning/10, text-warning
<Badge status="error">Überfällig</Badge>          // bg-error/10, text-error
<Badge status="neutral">Entwurf</Badge>           // bg-neutral-800, text-neutral-400
```

### Table

```tsx
// Minimalistisch, keine Zebra-Stripes
// Hover: bg-surface
// Borders: nur horizontal zwischen Rows
// Header: font-medium, text-text-muted, uppercase tracking-wide text-xs
```

---

## Layout

### Container

```tsx
// Max-width mit responsive Padding
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {children}
</div>
```

### Grid

```tsx
// Responsive Grid für Dashboard
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {cards}
</div>
```

### Stack

```tsx
// Vertikaler Stack mit konsistentem Gap
<div className="flex flex-col gap-4">
  {items}
</div>
```

---

## Rollen-Farben (Subtil)

Die Rollen haben keine dominanten Farben, aber subtile Akzente wo nötig:

| Rolle | Akzent (optional) | Verwendung |
|-------|-------------------|------------|
| Schüler | Indigo #6366F1 | Avatar-Ring, Rolle-Badge |
| Lehrkraft | Emerald #10B981 | Avatar-Ring, Rolle-Badge |
| Betrieb | Amber #F59E0B | Avatar-Ring, Rolle-Badge |
| Admin | Neutral | Kein Akzent nötig |

**Wichtig:** Diese Farben erscheinen NUR bei Avatar-Ringen und Rollen-Badges, nicht flächig.

---

## Dark Mode Only

Die App verwendet ausschließlich ein dunkles Theme. Kein Light Mode.

### Warum nur Dark Mode?

- **Einheitliche Erfahrung** – Keine Theme-Switching-Komplexität
- **Reduzierte Augenbelastung** bei längerer Nutzung
- **Moderne, professionelle Ausstrahlung** – Violett kommt auf Dunkel besser zur Geltung
- **Weniger "Schul-Software"-Feeling** – Distinktiv, nicht generisch
- **Einfachere Wartung** – Ein Theme, eine Wahrheit

### System-Präferenz

Die App ignoriert die System-Präferenz (`prefers-color-scheme`). Sie ist immer dunkel.

---

## Checkliste für neue Komponenten

- [ ] Verwendet nur definierte Tokens (keine hardcodierten Werte)
- [ ] Font: Display für Headlines, Body für Rest
- [ ] Farbe: Primary nur für primäre Aktionen
- [ ] Spacing aus der Scale (4, 6, 8...)
- [ ] Radius konsistent (md für Buttons/Inputs, lg für Cards)
- [ ] Focus-State vorhanden (ring + border)
- [ ] Transition für Hover/Focus (duration-fast)
- [ ] Responsive (Mobile-First)
- [ ] Accessible (Kontrast, Fokus, Labels)

---

## Anti-Patterns

### ❌ NIEMALS

```tsx
// Hardcodierte Farben
className="bg-[#3B82F6]"
className="text-[#666]"

// Hardcodierte Abstände
className="p-[14px]"
className="mt-[30px]"

// Generische Fonts
className="font-sans"  // → font-body oder font-display

// Zu viel Primary
<Button variant="primary">Speichern</Button>
<Button variant="primary">Vorschau</Button>  // ❌ → secondary
<Button variant="primary">Export</Button>    // ❌ → secondary

// Dekorative Elemente ohne Funktion
className="bg-gradient-to-r from-purple-500 to-pink-500"
className="animate-pulse"  // außer bei Loading-States

// Zu runde Ecken
className="rounded-full"  // → nur für Pills, Avatare
className="rounded-3xl"   // → max rounded-xl
```

### ✅ IMMER

```tsx
// Token verwenden
className="bg-primary"
className="text-text-secondary"
className="p-4"
className="rounded-md"

// Semantische Klassen
className="bg-surface"
className="border-border"

// cn() für bedingte Klassen
className={cn(
  "base-styles",
  isActive && "active-styles",
  className
)}
```

---

## Änderungshistorie

| Datum | Änderung |
|-------|----------|
| 2024-12-10 | Neue Version: "Quiet Confidence" Ästhetik |
| 2024-12-10 | Fonts: Instrument Sans + IBM Plex Sans |
| 2024-12-10 | Farbsystem: Dark Violet (#694AFF) aus alter DESIGN.md übernommen |
| 2024-12-10 | Dark Mode Only (kein Light Mode) |
