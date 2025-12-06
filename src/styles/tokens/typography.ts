/**
 * SCHRIFTARTEN
 *
 * Display Font: "Plus Jakarta Sans" – Modern, warm, mit Charakter
 * Body Font: "Source Sans 3" – Hervorragend lesbar, professionell
 * Mono Font: "JetBrains Mono" – Für Code-Snippets
 */
export const fontFamily = {
  display: 'var(--font-display)',
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const;

/**
 * SCHRIFTGRÖSSEN
 */
export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],
  sm: ['0.875rem', { lineHeight: '1.375rem' }],
  base: ['1rem', { lineHeight: '1.625rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.875rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
  '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
  '5xl': ['3rem', { lineHeight: '1.15' }],
} as const;

/**
 * SCHRIFTSTÄRKEN
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;
