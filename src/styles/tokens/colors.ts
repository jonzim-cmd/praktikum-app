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
 * Beide Themes nutzen die gleiche dunkle Palette
 */
export const colors = {
  primary: {
    DEFAULT: primitiveColors.violet.DEFAULT,
    hover: primitiveColors.violet.hover,
    light: 'rgba(105, 74, 255, 0.15)',
    foreground: primitiveColors.neutral[700], // Schwarz auf Violett
  },

  accent: {
    DEFAULT: primitiveColors.violet.DEFAULT,
    hover: primitiveColors.violet.hover,
    light: 'rgba(105, 74, 255, 0.15)',
    foreground: primitiveColors.neutral[700],
  },

  background: {
    DEFAULT: primitiveColors.neutral[600],    // #1E1E1E (Seiten-Hintergrund)
    subtle: primitiveColors.neutral[700],     // #111111 (Cards)
    muted: primitiveColors.neutral[500],      // #2A2A2A
    elevated: primitiveColors.neutral[700],   // #111111 (Cards)
  },

  foreground: {
    DEFAULT: primitiveColors.neutral[50],     // #FFFFFF
    muted: primitiveColors.neutral[200],      // #A0A0A0
    subtle: primitiveColors.neutral[300],     // #6B6B6B
  },

  border: {
    DEFAULT: primitiveColors.neutral[500],    // #2A2A2A
    strong: primitiveColors.neutral[400],     // #3D3D3D
    focus: primitiveColors.violet.DEFAULT,    // #694AFF
  },

  status: {
    success: {
      DEFAULT: primitiveColors.success.DEFAULT,
      bg: primitiveColors.success.light,
      text: primitiveColors.success.DEFAULT,
    },
    warning: {
      DEFAULT: primitiveColors.warning.DEFAULT,
      bg: primitiveColors.warning.light,
      text: primitiveColors.warning.DEFAULT,
    },
    error: {
      DEFAULT: primitiveColors.error.DEFAULT,
      bg: primitiveColors.error.light,
      text: primitiveColors.error.DEFAULT,
    },
    info: {
      DEFAULT: primitiveColors.violet.DEFAULT,
      bg: 'rgba(105, 74, 255, 0.15)',
      text: primitiveColors.violet.DEFAULT,
    },
  },
} as const;

// Beide Themes sind identisch (dunkles Design)
export const lightColors = colors;
export const darkColors = colors;

export type ColorTheme = typeof colors;
