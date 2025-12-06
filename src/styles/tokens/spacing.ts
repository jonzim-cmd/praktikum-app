/**
 * ABSTÄNDE
 * 4px Basis-System (wie Tailwind)
 */
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

/**
 * KOMPONENTEN-SPEZIFISCHE ABSTÄNDE
 */
export const componentSpacing = {
  input: {
    x: spacing[3],
    y: spacing[2],
  },
  button: {
    x: spacing[4],
    y: spacing[2],
  },
  card: {
    padding: spacing[6],
  },
  stack: {
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
  },
  section: {
    sm: spacing[8],
    md: spacing[12],
    lg: spacing[16],
  },
} as const;
