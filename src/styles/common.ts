import { CSSProperties } from 'react';
import { colors, spacing, fontSize, borderRadius, fontWeight } from './tokens';

// Common container styles
export const container = {
  base: {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: spacing['2xl'],
  } as CSSProperties,
  
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as CSSProperties,
};

// Card styles
export const card = {
  base: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  } as CSSProperties,
  
  header: {
    padding: `${spacing.lg} ${spacing.xl}`,
    borderBottom: `2px solid ${colors.gray300}`,
    backgroundColor: colors.gray50,
  } as CSSProperties,
};

// Button styles
export const button = {
  base: {
    padding: `${spacing.md} ${spacing['2xl']}`,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    border: 'none',
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  } as CSSProperties,
  
  primary: {
    backgroundColor: colors.primary,
    color: colors.white,
  } as CSSProperties,
  
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  } as CSSProperties,
};

// Input styles
export const input = {
  base: {
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: fontSize.base,
    border: `1px solid ${colors.gray400}`,
    borderRadius: borderRadius.sm,
    width: '100%',
  } as CSSProperties,
};

// Table styles
export const table = {
  wrapper: {
    overflowX: 'auto' as const,
  } as CSSProperties,
  
  base: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: fontSize.sm,
  } as CSSProperties,
  
  th: {
    padding: spacing.md,
    textAlign: 'left' as const,
    fontWeight: fontWeight.semibold,
    color: colors.gray700,
    borderBottom: `2px solid ${colors.gray300}`,
    whiteSpace: 'nowrap' as const,
    backgroundColor: colors.gray50,
  } as CSSProperties,
  
  td: {
    padding: spacing.md,
    verticalAlign: 'middle' as const,
    borderBottom: `1px solid ${colors.gray300}`,
  } as CSSProperties,
};

// Message styles
export const message = {
  base: {
    padding: spacing['3xl'],
    textAlign: 'center' as const,
    color: colors.textSecondary,
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.md,
  } as CSSProperties,
  
  error: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.errorBg,
    color: colors.error,
    border: `1px solid ${colors.errorBorder}`,
    borderRadius: borderRadius.sm,
  } as CSSProperties,
};