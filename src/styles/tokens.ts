export const colors = {
    // Primary
    primary: '#0070f3',
    primaryHover: '#0051cc',
    
    // Neutral
    white: '#ffffff',
    gray50: '#f8f9fa',
    gray100: '#f5f5f5',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray400: '#ddd',
    gray500: '#adb5bd',
    gray600: '#666',
    gray700: '#495057',
    gray800: '#343a40',
    gray900: '#212529',
    
    // Semantic
    error: '#c33',
    errorBg: '#fee',
    errorBorder: '#fcc',
    
    // Text
    textPrimary: '#333',
    textSecondary: '#666',
    textMuted: '#999',
    
    // Border
    border: '#ddd',
    borderLight: '#e5e5e5',
} as const;

export const spacing = {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    '3xl': '3rem',    // 48px
} as const;

export const fontSize = {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
} as const;

export const borderRadius = {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
} as const;

export const fontWeight = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
} as const;

export const breakpoints = {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
} as const;