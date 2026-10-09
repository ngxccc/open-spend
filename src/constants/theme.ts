import { Platform } from 'react-native';

/**
 * OpenSpend - Obsidian Slate Theme Tokens
 * Generated strictly from DESIGN.md
 */

export const SlateColors = {
  // Base Canvas & Surface Tiers
  surface: '#131315',
  surfaceDim: '#131315',
  surfaceBright: '#39393b',
  surfaceLowest: '#0e0e10',
  surfaceLow: '#1b1b1d',
  surfaceContainer: '#201f21',
  surfaceHigh: '#2a2a2c',
  surfaceHighest: '#353437',

  // Typography & Content
  primary: '#ffffff',
  onPrimary: '#121214',
  secondary: '#c6c6cf',
  onSurface: '#e5e1e4',
  onSurfaceVariant: '#c4c7c9',
  muted: '#8e9193',
  subtle: '#71717a',

  // Borders & Dividers
  outline: '#8e9193',
  outlineVariant: '#444749',
  border: '#27272a',
  borderInteractive: '#3f3f46',

  // Status & Feedback
  error: '#ffb4ab',
  success: '#34d399',
} as const;

export const Colors = {
  light: {
    text: SlateColors.primary,
    background: SlateColors.surface,
    backgroundElement: SlateColors.surfaceLow,
    backgroundSelected: SlateColors.surfaceContainer,
    textSecondary: SlateColors.onSurfaceVariant,
  },
  dark: {
    text: SlateColors.primary,
    background: SlateColors.surface,
    backgroundElement: SlateColors.surfaceLow,
    backgroundSelected: SlateColors.surfaceContainer,
    textSecondary: SlateColors.onSurfaceVariant,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
}) ?? {
  sans: 'normal',
  serif: 'serif',
  rounded: 'normal',
  mono: 'monospace',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
