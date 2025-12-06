# Design System – Praktikumsmanagement-App

## Ästhetische Richtung

**Konzept: "Dark Violet"** – Modern, elegant, professionell. Ein dunkles Theme mit Violett als Akzentfarbe, das für Schüler ansprechend und für Lehrkräfte seriös wirkt.

### Kernprinzipien

- **Dark Mode First**: Dunkles Theme als Standard für reduzierte Augenbelastung
- **Violett als Akzent**: Moderne, distinktive Primärfarbe
- **Klare Kontraste**: Helle Texte auf dunklem Hintergrund
- **Pill-Style Buttons**: Abgerundete Buttons (42px Radius) für moderne Optik
- **Typografie mit Charakter**: Distinktive Fonts, keine generischen System-Fonts
- **Subtile Bewegung**: Micro-Interactions und Page Transitions, die Freude machen

### Farbpalette

| Rolle | Hex-Wert | Verwendung |
|-------|----------|------------|
| **Primary** | #694AFF (Violett) | Buttons, Links, Akzente |
| **Background** | #1E1E1E (Dunkelgrau) | Seiten-Hintergrund |
| **Background Subtle** | #111111 (Schwarz) | Cards, Kacheln |
| **Foreground** | #FFFFFF (Weiß) | Haupttext |
| **Success** | #41DF82 (Grün) | Erfolgsmeldungen |
| **Warning** | #FF5900 (Orange) | Warnungen |
| **Error** | #D7003D (Rot) | Fehler |

---

## Philosophie (Code-Organisation)

1. **Single Source of Truth** – Design-Entscheidungen an einem Ort
2. **Keine hardgecodeten Werte** – Alles über Tokens/Variablen
3. **Konsistenz durch Struktur** – Nicht durch Disziplin
4. **Dark Mode First-Class** – Beide Themes gleichwertig implementiert

---

## Design Token Architektur

### Verzeichnisstruktur

```
src/
├── styles/
│   ├── globals.css           # Tailwind v4 @theme + CSS-Variablen + Base-Styles
│   ├── tokens/
│   │   ├── colors.ts         # Farbpalette (Light + Dark) - TypeScript-Referenz
│   │   ├── typography.ts     # Schriften, Größen - TypeScript-Referenz
│   │   ├── spacing.ts        # Abstände - TypeScript-Referenz
│   │   ├── shadows.ts        # Schatten (Light + Dark) - TypeScript-Referenz
│   │   ├── borders.ts        # Radien, Breiten - TypeScript-Referenz
│   │   ├── animations.ts     # Transitions, Keyframes - TypeScript-Referenz
│   │   └── index.ts          # Re-export aller Tokens
│   └── fonts/
│       └── index.ts          # Font-Definitionen (Next.js Font Optimization)
└── components/
    └── ui/                   # shadcn/ui Komponenten

Hinweis: Mit Tailwind v4 wird keine tailwind.config.ts mehr benötigt.
Alle Design-Tokens werden direkt in globals.css mit @theme definiert.
Die TypeScript-Dateien in tokens/ dienen als Dokumentation und Referenz.
```

### Token-Hierarchie

```
┌─────────────────────────────────────────────────────────────┐
│                     PRIMITIVE TOKENS                        │
│  Rohe Werte: blue-500: "#3b82f6", spacing-4: "1rem"        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     SEMANTIC TOKENS                         │
│  Bedeutung: primary: blue-500, error: red-500              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT TOKENS                         │
│  Kontext: button-bg: primary, input-border: border-default │
└─────────────────────────────────────────────────────────────┘
```

---

## Token Definitionen

### Farben (`src/styles/tokens/colors.ts`)

```typescript
/**
 * PRIMITIVE FARBEN
 * Niemals direkt im Code verwenden!
 * Dunkle Palette mit Violett als Akzent.
 */
const primitiveColors = {
  // Neutrale Grautöne (Dunkel)
  neutral: {
    50: '#FFFFFF',
    100: '#E5E5E5',
    200: '#A0A0A0',
    300: '#6B6B6B',
    400: '#3D3D3D',
    500: '#2A2A2A',
    600: '#1E1E1E',
    700: '#111111',
    800: '#0A0A0A',
    900: '#000000',
  },

  // Primärfarbe: Violett
  violet: {
    light: '#8B6FFF',
    DEFAULT: '#694AFF',
    hover: '#7B5FFF',
    dark: '#5438CC',
  },

  // Status Colors
  success: {
    DEFAULT: '#41DF82',
    light: 'rgba(65, 223, 130, 0.15)',
  },
  warning: {
    DEFAULT: '#FF5900',
    light: 'rgba(255, 89, 0, 0.15)',
  },
  error: {
    DEFAULT: '#D7003D',
    light: 'rgba(215, 0, 61, 0.15)',
  },
} as const;

/**
 * THEME COLORS
 * Beide Themes (Light/Dark) nutzen die gleiche dunkle Palette
 */
export const colors = {
  primary: {
    DEFAULT: '#694AFF',      // Violett
    hover: '#7B5FFF',
    light: 'rgba(105, 74, 255, 0.15)',
    foreground: '#111111',   // Schwarz auf Violett
  },

  background: {
    DEFAULT: '#1E1E1E',      // Seiten-Hintergrund
    subtle: '#111111',       // Cards, Kacheln
    muted: '#2A2A2A',
    elevated: '#111111',     // Cards, Kacheln
  },

  foreground: {
    DEFAULT: '#FFFFFF',      // Haupttext
    muted: '#A0A0A0',
    subtle: '#6B6B6B',
  },

  border: {
    DEFAULT: '#2A2A2A',
    strong: '#3D3D3D',
    focus: '#694AFF',
  },

  status: {
    success: {
      DEFAULT: '#41DF82',
      bg: 'rgba(65, 223, 130, 0.15)',
      text: '#41DF82',
    },
    warning: {
      DEFAULT: '#FF5900',
      bg: 'rgba(255, 89, 0, 0.15)',
      text: '#FF5900',
    },
    error: {
      DEFAULT: '#D7003D',
      bg: 'rgba(215, 0, 61, 0.15)',
      text: '#D7003D',
    },
    info: {
      DEFAULT: '#694AFF',    // Info = Primary
      bg: 'rgba(105, 74, 255, 0.15)',
      text: '#694AFF',
    },
  },
} as const;

// Beide Themes sind identisch (dunkles Design)
export const lightColors = colors;
export const darkColors = colors;
```

### Typografie (`src/styles/tokens/typography.ts`)

```typescript
/**
 * SCHRIFTARTEN
 *
 * Display Font: "Plus Jakarta Sans" – Modern, warm, mit Charakter
 * Body Font: "Source Sans 3" – Hervorragend lesbar, professionell
 * Mono Font: "JetBrains Mono" – Für Code-Snippets
 *
 * KEINE generischen Fonts wie Inter, Roboto, Arial, system-ui!
 */
export const fontFamily = {
  display: 'var(--font-display)',  // Plus Jakarta Sans
  sans: 'var(--font-sans)',        // Source Sans 3
  mono: 'var(--font-mono)',        // JetBrains Mono
} as const;

/**
 * SCHRIFTGRÖSSEN
 * Leicht größere Basis für bessere Lesbarkeit auf allen Geräten.
 */
export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],        // 12px
  sm: ['0.875rem', { lineHeight: '1.375rem' }],   // 14px
  base: ['1rem', { lineHeight: '1.625rem' }],     // 16px – erhöhte Line-Height
  lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
  xl: ['1.25rem', { lineHeight: '1.875rem' }],    // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
  '3xl': ['1.875rem', { lineHeight: '2.375rem' }],// 30px
  '4xl': ['2.25rem', { lineHeight: '2.75rem' }],  // 36px
  '5xl': ['3rem', { lineHeight: '1.15' }],        // 48px – für Hero-Headlines
} as const;

/**
 * SCHRIFTSTÄRKEN
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',  // Für Display-Headlines
} as const;
```

### Font-Setup (`src/styles/fonts/index.ts`)

```typescript
import { Plus_Jakarta_Sans, Source_Sans_3, JetBrains_Mono } from 'next/font/google';

export const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

export const sansFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});
```

### Spacing (`src/styles/tokens/spacing.ts`)

```typescript
/**
 * ABSTÄNDE
 * 4px Basis-System (wie Tailwind)
 * 
 * Verwendung:
 * - spacing.1 = 4px (kleine Abstände in Komponenten)
 * - spacing.2 = 8px (Standard-Padding)
 * - spacing.4 = 16px (Komponenten-Abstände)
 * - spacing.6 = 24px (Section-Abstände)
 * - spacing.8 = 32px (große Abstände)
 */
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const;

/**
 * KOMPONENTEN-SPEZIFISCHE ABSTÄNDE
 * Semantische Namen für häufige Verwendungen
 */
export const componentSpacing = {
  // Innen-Abstände
  input: {
    x: spacing[3],      // Horizontal Padding
    y: spacing[2],      // Vertical Padding
  },
  button: {
    x: spacing[4],
    y: spacing[2],
  },
  card: {
    padding: spacing[6],
  },
  
  // Außen-Abstände
  stack: {
    sm: spacing[2],     // Enge Liste
    md: spacing[4],     // Standard-Liste
    lg: spacing[6],     // Lockere Liste
  },
  section: {
    sm: spacing[8],
    md: spacing[12],
    lg: spacing[16],
  },
} as const;
```

### Schatten (`src/styles/tokens/shadows.ts`)

```typescript
/**
 * SHADOWS
 * Dunkle Schatten mit Violett-Glow für Primary
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',

  // Violett-Glow für Primary-Elemente
  primary: '0 0 20px 0 rgba(105, 74, 255, 0.3)',
  accent: '0 0 20px 0 rgba(105, 74, 255, 0.3)',

  // Fokus-Ring
  focus: '0 0 0 2px var(--color-primary-light), 0 0 0 4px var(--color-primary)',
} as const;

// Beide Themes nutzen die gleichen Schatten
export const lightShadows = shadows;
export const darkShadows = shadows;
```

### Border Radii (`src/styles/tokens/borders.ts`)

```typescript
export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',   // Pill/Circle
} as const;

export const borderWidth = {
  DEFAULT: '1px',
  0: '0',
  2: '2px',
} as const;
```

### Animationen (`src/styles/tokens/animations.ts`)

```typescript
export const transitions = {
  // Dauer
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    page: '400ms',
  },

  // Timing Functions – charaktervolle Easing-Kurven
  ease: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Charaktervolle Kurven
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    snappy: 'cubic-bezier(0.2, 0, 0, 1)',
  },
} as const;

/**
 * Vordefinierte Transitions für häufige Anwendungen
 */
export const transitionPresets = {
  interactive: `all ${transitions.duration.fast} ${transitions.ease.snappy}`,
  colors: `color ${transitions.duration.fast}, background-color ${transitions.duration.fast}, border-color ${transitions.duration.fast}`,
  transform: `transform ${transitions.duration.normal} ${transitions.ease.out}`,
  opacity: `opacity ${transitions.duration.normal} ${transitions.ease.DEFAULT}`,
  shadow: `box-shadow ${transitions.duration.normal} ${transitions.ease.out}`,
} as const;

/**
 * KEYFRAME ANIMATIONEN
 * Für Page Loads, Staggered Reveals, Micro-Interactions
 */
export const keyframes = {
  // Fade In mit leichtem Slide
  fadeInUp: {
    from: { opacity: '0', transform: 'translateY(10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  fadeInDown: {
    from: { opacity: '0', transform: 'translateY(-10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },

  // Scale für Modals/Tooltips
  scaleIn: {
    from: { opacity: '0', transform: 'scale(0.95)' },
    to: { opacity: '1', transform: 'scale(1)' },
  },

  // Subtle Pulse für Aufmerksamkeit
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.7' },
  },

  // Shimmer für Loading States
  shimmer: {
    from: { backgroundPosition: '-200% 0' },
    to: { backgroundPosition: '200% 0' },
  },

  // Slide für Drawer/Panels
  slideInRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
  },
} as const;

/**
 * ANIMATION PRESETS
 * Kombinationen aus Keyframes + Timing
 */
export const animations = {
  fadeInUp: `fadeInUp ${transitions.duration.slow} ${transitions.ease.smooth} forwards`,
  fadeInDown: `fadeInDown ${transitions.duration.slow} ${transitions.ease.smooth} forwards`,
  scaleIn: `scaleIn ${transitions.duration.normal} ${transitions.ease.out} forwards`,
  pulse: `pulse 2s ${transitions.ease.inOut} infinite`,
  shimmer: `shimmer 2s linear infinite`,
  slideInRight: `slideInRight ${transitions.duration.page} ${transitions.ease.snappy} forwards`,
  slideInLeft: `slideInLeft ${transitions.duration.page} ${transitions.ease.snappy} forwards`,
} as const;

/**
 * STAGGER DELAYS
 * Für orchestrierte Page-Load Animationen
 */
export const staggerDelays = {
  fast: ['0ms', '50ms', '100ms', '150ms', '200ms'],
  normal: ['0ms', '75ms', '150ms', '225ms', '300ms'],
  slow: ['0ms', '100ms', '200ms', '300ms', '400ms'],
} as const;
```

---

## Tailwind v4 Integration

### Kein `tailwind.config.ts` mehr nötig!

Mit Tailwind v4 werden alle Design-Tokens direkt in `globals.css` mit der `@theme` Direktive definiert. Das macht die Konfiguration einfacher und zentralisiert alles an einem Ort.

### So funktioniert es:

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  /* Farben werden direkt als CSS Custom Properties definiert */
  --color-primary: hsl(173 82% 30%);
  --color-primary-hover: hsl(173 83% 26%);
  --color-primary-foreground: hsl(0 0% 100%);

  /* Tailwind generiert automatisch Utility-Klassen */
  /* bg-primary, text-primary-foreground, etc. */
}

/* Dark Mode überschreibt die Variablen */
.dark {
  --color-primary: hsl(172 66% 50%);
  /* ... */
}
```

### Verwendung in Komponenten:

```tsx
// Die generierten Klassen funktionieren automatisch
<button className="bg-primary text-primary-foreground hover:bg-primary-hover">
  Klick mich
</button>

// Dark Mode funktioniert automatisch via CSS-Variablen
// Keine dark: Prefix nötig!
```

### Vorteile von Tailwind v4:

1. **Kein Config-File**: Alles in `globals.css`
2. **Native CSS-Variablen**: Dark Mode "just works"
3. **Schnellere Builds**: Weniger JavaScript-Konfiguration
4. **Bessere IDE-Integration**: CSS ist Standard

---

## globals.css Struktur (Tailwind v4)

Die aktuelle `globals.css` nutzt Tailwind v4's `@theme` Direktive. Hier die wichtigsten Abschnitte:

```css
@import "tailwindcss";

@theme {
  /* Alle Design-Tokens hier definiert */
  --color-primary: hsl(173 82% 30%);
  --color-accent: hsl(25 95% 53%);
  /* ... weitere Tokens ... */
}

@layer base {
  /* Base-Styles für body, Borders, etc. */
}

.dark {
  /* Dark Mode überschreibt die Variablen */
  --color-primary: hsl(172 66% 50%);
  /* ... */
}

/* Keyframe Animationen */
@keyframes fadeInUp { /* ... */ }
```

**Wichtig**: Mit Tailwind v4 werden die Farb-Variablen als `--color-*` definiert (nicht mehr `--primary`), und Tailwind generiert automatisch die passenden Utility-Klassen (`bg-primary`, `text-primary`, etc.).

---

## Komponenten-Konventionen

### Grundregeln

```typescript
/**
 * REGEL 1: Keine hardgecodeten Werte
 */

// ❌ FALSCH
<div className="bg-[#0d9488] p-[14px] rounded-[6px]">

// ✅ RICHTIG
<div className="bg-primary p-4 rounded-md">


/**
 * REGEL 2: Semantische Klassennamen bevorzugen
 */

// ❌ FALSCH
<p className="text-stone-600 text-sm">

// ✅ RICHTIG
<p className="text-foreground-muted text-sm">


/**
 * REGEL 3: Display Font für Headlines
 */

// ❌ FALSCH
<h1 className="text-2xl font-bold">Titel</h1>

// ✅ RICHTIG
<h1 className="font-display text-2xl font-bold">Titel</h1>


/**
 * REGEL 4: Komponenten-Varianten mit cva (class-variance-authority)
 */
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles mit Theme-aware Shadows
  'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-theme-primary',
        accent: 'bg-accent text-accent-foreground hover:bg-accent-hover',
        secondary: 'bg-background-muted text-foreground hover:bg-background-subtle',
        outline: 'border border-border bg-transparent hover:bg-background-subtle',
        ghost: 'hover:bg-background-subtle',
        destructive: 'bg-error text-white hover:bg-error/90',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

### shadcn/ui Anpassungen

shadcn/ui Komponenten werden in `src/components/ui/` gespeichert und nutzen unsere Tokens:

```typescript
// src/components/ui/button.tsx
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Buttons mit Pill-Style (42px Radius) und semantischen Farben
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[42px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-primary',
        accent: 'bg-accent text-accent-foreground hover:bg-accent-hover shadow-sm',
        secondary: 'bg-background-subtle text-primary hover:bg-background-muted border border-border',
        outline: 'border border-border bg-transparent text-foreground hover:bg-background-muted',
        ghost: 'text-foreground hover:bg-background-muted',
        destructive: 'bg-error text-white hover:opacity-90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

---

## Zustands-Patterns

### Status-Badges (Ampel-System)

```typescript
// src/components/ui/status-badge.tsx
import { cva } from 'class-variance-authority';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      status: {
        success: 'bg-success-bg text-success-text',
        warning: 'bg-warning-bg text-warning-text',
        error: 'bg-error-bg text-error-text',
        info: 'bg-info-bg text-info-text',
        neutral: 'bg-background-muted text-foreground-muted',
      },
    },
  }
);

// Mit Dot-Indikator
export function StatusBadge({ status, children }: Props) {
  return (
    <span className={statusBadgeVariants({ status })}>
      <span className={cn(
        'h-1.5 w-1.5 rounded-full',
        status === 'success' && 'bg-success',
        status === 'warning' && 'bg-warning',
        status === 'error' && 'bg-error',
      )} />
      {children}
    </span>
  );
}
```

### Loading States

```typescript
// Konsistente Loading-Anzeigen

// Skeleton für Content
<div className="animate-pulse rounded-md bg-background-muted h-4 w-32" />

// Spinner für Actions
<Loader2 className="h-4 w-4 animate-spin" />

// Button Loading State
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Wird gespeichert...
</Button>

// Full-page Loading
<div className="flex h-full items-center justify-center">
  <Loader2 className="h-8 w-8 animate-spin text-primary" />
</div>
```

### Empty States

```typescript
// src/components/ui/empty-state.tsx
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-background-muted p-3 mb-4">
        <Icon className="h-6 w-6 text-foreground-muted" />
      </div>
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-foreground-muted max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
```

### Error States

```typescript
// Inline Error (bei Inputs)
<p className="text-sm text-error mt-1">{error.message}</p>

// Error Alert
<Alert variant="error">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Fehler</AlertTitle>
  <AlertDescription>{message}</AlertDescription>
</Alert>

// Full-page Error
<div className="flex flex-col items-center justify-center py-12">
  <XCircle className="h-12 w-12 text-error mb-4" />
  <h2 className="text-xl font-semibold">Etwas ist schiefgelaufen</h2>
  <p className="text-foreground-muted mt-2">{message}</p>
  <Button onClick={retry} className="mt-4">Erneut versuchen</Button>
</div>
```

---

## Responsive Design

### Breakpoints

```typescript
// Tailwind Standard-Breakpoints (Mobile-First)
const breakpoints = {
  sm: '640px',   // Große Smartphones
  md: '768px',   // Tablets
  lg: '1024px',  // Kleine Laptops
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Große Screens
};

// Verwendung
<div className="
  grid 
  grid-cols-1      // Mobile: 1 Spalte
  sm:grid-cols-2   // ab 640px: 2 Spalten
  lg:grid-cols-3   // ab 1024px: 3 Spalten
">
```

### Container

```typescript
// Zentrierter Container mit max-width
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {children}
</div>

// Als Komponente
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}
```

### Mobile-First Patterns

```typescript
// Navigation: Mobile Bottom, Desktop Sidebar
<nav className="
  fixed bottom-0 left-0 right-0 border-t  // Mobile: Bottom Bar
  md:static md:border-t-0 md:border-r md:w-64 md:h-screen  // Desktop: Sidebar
">

// Cards: Stack auf Mobile, Grid auf Desktop
<div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">

// Tabelle: Cards auf Mobile, Table auf Desktop
<div className="block md:hidden">{/* Card View */}</div>
<div className="hidden md:block">{/* Table View */}</div>
```

---

## Accessibility Grundregeln

### Fokus-States

```css
/* Alle interaktiven Elemente brauchen sichtbaren Fokus */
.focus-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2;
}

/* Nie outline entfernen ohne Alternative */
/* ❌ */ :focus { outline: none; }
/* ✅ */ :focus-visible { /* custom focus style */ }
```

### Kontrast

```typescript
// Mindest-Kontrast: 4.5:1 für normalen Text, 3:1 für großen Text

// ❌ FALSCH: Grau auf Grau
<p className="text-gray-400 bg-gray-100">Schwer lesbar</p>

// ✅ RICHTIG: Ausreichend Kontrast
<p className="text-foreground-muted bg-background">Gut lesbar</p>
```

### Semantisches HTML

```typescript
// ❌ FALSCH
<div onClick={handleClick}>Klick mich</div>

// ✅ RICHTIG
<button onClick={handleClick}>Klick mich</button>

// ❌ FALSCH
<div className="input-style">
  <input />
</div>

// ✅ RICHTIG
<label>
  <span>E-Mail</span>
  <input type="email" />
</label>
```

### Screen Reader

```typescript
// Versteckter Text für Screen Reader
<span className="sr-only">Menü öffnen</span>

// ARIA Labels
<button aria-label="Schließen">
  <X className="h-4 w-4" />
</button>

// Live Regions für dynamische Inhalte
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

---

## App-spezifische Patterns

### Fortschrittsbalken (Praktikumstage)

```typescript
// src/components/progress-bar.tsx
interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export function ProgressBar({ current, total, showLabel = true }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-foreground-muted">Fortschritt</span>
          <span className="font-medium">{current} / {total} Tage</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-background-muted overflow-hidden">
        <div 
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

### Ampel-Status für Schüler-Liste

```typescript
// src/components/student-status-indicator.tsx
type StudentStatus = 'on-track' | 'attention' | 'critical';

const statusConfig: Record<StudentStatus, { color: string; label: string }> = {
  'on-track': { color: 'bg-success', label: 'Im Plan' },
  'attention': { color: 'bg-warning', label: 'Aufmerksamkeit nötig' },
  'critical': { color: 'bg-error', label: 'Kritisch' },
};

export function StudentStatusIndicator({ status }: { status: StudentStatus }) {
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', config.color)} />
      <span className="text-sm text-foreground-muted">{config.label}</span>
    </div>
  );
}
```

### Dashboard-Karte

```typescript
// src/components/dashboard/stat-card.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    positive: boolean;
  };
}

export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground-muted">{title}</p>
        {Icon && <Icon className="h-4 w-4 text-foreground-muted" />}
      </div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {(description || trend) && (
        <div className="mt-1 flex items-center gap-2 text-sm">
          {trend && (
            <span className={trend.positive ? 'text-success' : 'text-error'}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-foreground-muted">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Do's and Don'ts

### ✅ DO

```typescript
// Semantische Token-Namen verwenden
className="bg-primary text-primary-foreground"
className="text-foreground-muted"
className="border-border"

// Display Font für Headlines
className="font-display text-2xl font-bold"

// Secondary Button für sekundäre CTAs
className="bg-background-subtle text-primary"

// Spacing-Skala nutzen
className="p-4 mt-6 gap-2"

// Varianten mit cva definieren
const variants = cva('base', { variants: { ... } });

// cn() für bedingte Klassen
className={cn('base', isActive && 'active', className)}

// Fokus-States immer definieren
className="focus-visible:ring-2 focus-visible:ring-border-focus"

// Animationen nutzen
className="animate-fadeInUp"
className="hover:shadow-primary transition-shadow"

// Pill-Style Buttons (42px Radius)
className="rounded-[42px]"
```

### ❌ DON'T

```typescript
// Hardgecodete Farben
className="bg-[#694AFF]"  // → bg-primary
className="text-[#666]"

// Hardgecodete Abstände
className="p-[14px]"
className="mt-[30px]"

// Inline Styles für Layout
style={{ marginTop: 20, color: 'violet' }}

// Alte Farben (existieren nicht mehr!)
className="bg-teal-600"    // ❌ Entfernt → bg-primary
className="bg-coral-500"   // ❌ Entfernt
className="text-stone-500" // ❌ Entfernt → text-foreground-muted

// Generische Fonts
className="font-sans"  // → font-display für Headlines

// Outline entfernen ohne Alternative
className="outline-none focus:outline-none"

// Light-Mode spezifische Klassen (beide Themes sind dunkel)
className="bg-white"  // ❌ → bg-background-subtle
```

---

## Checkliste für neue Komponenten

- [ ] Verwendet semantische Farb-Tokens (`primary`, `accent`, `foreground`, `border`)
- [ ] Verwendet `font-display` für Headlines
- [ ] Verwendet Spacing aus der Skala (`p-4`, nicht `p-[15px]`)
- [ ] Hat Fokus-State (`focus-visible:ring-...`)
- [ ] Hat Hover-State mit Transition (`transition-all`, `hover:shadow-theme-primary`)
- [ ] Hat Loading-State falls async (mit `animate-shimmer` oder Spinner)
- [ ] Hat Error-State falls Validierung
- [ ] Hat Empty-State falls Liste
- [ ] Ist responsive (Mobile-First)
- [ ] Nutzt `cn()` für className-Merging
- [ ] Varianten über `cva` definiert
- [ ] TypeScript Props Interface
- [ ] Accessibility: Semantisches HTML, ARIA wo nötig

---

## Theme Implementation

### Dunkles Theme als Standard

Das Design System verwendet ein dunkles Theme als Standard. Beide Light- und Dark-Mode nutzen die gleiche dunkle Farbpalette, sodass die App immer dunkel erscheint, unabhängig von der System-Einstellung.

### Theme Provider Setup

```typescript
// src/app/layout.tsx
import { ThemeProvider } from 'next-themes';
import { displayFont, sansFont, monoFont } from '@/styles/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Wichtige Regeln

1. **Beide Themes sind identisch** – Light und Dark nutzen die gleiche dunkle Palette
2. **`suppressHydrationWarning`** auf `<html>` für SSR-Kompatibilität
3. **`enableSystem`** respektiert OS-Präferenz (visuell kein Unterschied)
4. **Violett-Glow** für Primary-Elemente via `shadow-primary`

---

## Weiterführende Ressourcen

- **shadcn/ui Dokumentation**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI (Primitives)**: https://www.radix-ui.com
- **CVA (Class Variance Authority)**: https://cva.style
- **next-themes**: https://github.com/pacocoursey/next-themes
- **Google Fonts (Plus Jakarta Sans)**: https://fonts.google.com/specimen/Plus+Jakarta+Sans
- **Google Fonts (Source Sans 3)**: https://fonts.google.com/specimen/Source+Sans+3