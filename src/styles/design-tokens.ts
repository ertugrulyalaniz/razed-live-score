export const designTokens = {
  colors: {
    background: {
      page: '#1e1e1e',
      card: '#4d4d4d',
      cardHover: '#5a5a5a',
      elevated: '#3d3d3d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      muted: '#8a8a8a',
    },
    status: {
      live: '#4ade80',
      liveGlow: 'rgba(196, 160, 0, 0.3)',
      finished: '#4ade80',
      halftime: '#fbbf24',
      upcoming: '#8a8a8a',
      canceled: '#e07777',
    },
    ui: {
      border: '#6a6a6a',
      borderLight: '#7a7a7a',
      filterActive: '#5a5a5a',
      filterBadge: '#6a6a6a',
    },
  },

  typography: {
    fontFamily: "'Barlow', sans-serif",
    fontSize: {
      xs: '0.625rem',
      sm: '0.75rem',
      base: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '2rem',
      '3xl': '2.5rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
  },

  borders: {
    radius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      full: '9999px',
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '3px',
    },
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
  },

  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
  },

  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export type DesignTokens = typeof designTokens;
