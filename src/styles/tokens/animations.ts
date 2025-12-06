export const transitions = {
  duration: {
    instant: '0ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    page: '400ms',
  },
  ease: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    snappy: 'cubic-bezier(0.2, 0, 0, 1)',
  },
} as const;

export const transitionPresets = {
  interactive: `all ${transitions.duration.fast} ${transitions.ease.snappy}`,
  colors: `color ${transitions.duration.fast}, background-color ${transitions.duration.fast}, border-color ${transitions.duration.fast}`,
  transform: `transform ${transitions.duration.normal} ${transitions.ease.out}`,
  opacity: `opacity ${transitions.duration.normal} ${transitions.ease.DEFAULT}`,
  shadow: `box-shadow ${transitions.duration.normal} ${transitions.ease.out}`,
} as const;

export const keyframes = {
  fadeInUp: {
    from: { opacity: '0', transform: 'translateY(10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  fadeInDown: {
    from: { opacity: '0', transform: 'translateY(-10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  scaleIn: {
    from: { opacity: '0', transform: 'scale(0.95)' },
    to: { opacity: '1', transform: 'scale(1)' },
  },
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.7' },
  },
  shimmer: {
    from: { backgroundPosition: '-200% 0' },
    to: { backgroundPosition: '200% 0' },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
  },
} as const;

export const animations = {
  fadeInUp: `fadeInUp ${transitions.duration.slow} ${transitions.ease.smooth} forwards`,
  fadeInDown: `fadeInDown ${transitions.duration.slow} ${transitions.ease.smooth} forwards`,
  scaleIn: `scaleIn ${transitions.duration.normal} ${transitions.ease.out} forwards`,
  pulse: `pulse 2s ${transitions.ease.inOut} infinite`,
  shimmer: `shimmer 2s linear infinite`,
  slideInRight: `slideInRight ${transitions.duration.page} ${transitions.ease.snappy} forwards`,
  slideInLeft: `slideInLeft ${transitions.duration.page} ${transitions.ease.snappy} forwards`,
} as const;

export const staggerDelays = {
  fast: ['0ms', '50ms', '100ms', '150ms', '200ms'],
  normal: ['0ms', '75ms', '150ms', '225ms', '300ms'],
  slow: ['0ms', '100ms', '200ms', '300ms', '400ms'],
} as const;
