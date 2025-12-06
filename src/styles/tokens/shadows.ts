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
  primary: '0 0 20px 0 rgba(105, 74, 255, 0.3)',
  accent: '0 0 20px 0 rgba(105, 74, 255, 0.3)',
  focus: '0 0 0 2px var(--color-primary-light), 0 0 0 4px var(--color-primary)',
} as const;

// Beide Themes nutzen die gleichen Schatten
export const lightShadows = shadows;
export const darkShadows = shadows;
