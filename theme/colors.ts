// Light theme color palette
export const lightColors = {
  // Background & Surface colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F9FA',
  card: '#FFFFFF',

  // Text colors
  text: '#1A202C',
  textSecondary: '#4A5568',
  textInverse: '#FFFFFF',

  // Brand colors
  primary: '#6366F1',
  secondary: '#E2E8F0',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Finance-specific colors
  income: '#10B981',
  expense: '#EF4444',
  transfer: '#3B82F6',
  savings: '#059669',

  // Form & Input colors
  input: {
    background: '#FFFFFF',
    border: '#E2E8F0',
    placeholder: '#A0ADB8'
  },

  // Button states
  button: {
    primaryBg: '#6366F1',
    primaryBgDisabled: '#CBD5E0',
    primaryText: '#FFFFFF',
    primaryTextDisabled: '#A0ADB8',

    secondaryBg: 'transparent',
    secondaryBorder: '#E2E8F0',
    secondaryText: '#4A5568',

    destructiveBg: '#EF4444',
    destructiveText: '#FFFFFF'
  },

  // Border & Divider colors
  border: '#E2E8F0',
  borderLight: '#F7FAFC',
  borderStrong: '#CBD5E0',

  // Shadow & Elevation
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowStrong: 'rgba(0, 0, 0, 0.15)',

  // Tab bar specific colors
  tabBar: {
    background: '#FFFFFF',
    border: '#E2E8F0',
    activeIcon: '#6366F1',
    inactiveIcon: '#718096',
    activeLabel: '#6366F1',
    inactiveLabel: '#718096',
    focusBackground: 'rgba(99, 102, 241, 0.1)'
  },

  // Icon background colors for better semantic meaning
  iconBackground: {
    neutral: '#F1F5F9',
    primary: 'rgba(99, 102, 241, 0.1)',
    success: 'rgba(16, 185, 129, 0.1)',
    warning: 'rgba(245, 158, 11, 0.1)',
    error: 'rgba(239, 68, 68, 0.1)',
    info: 'rgba(59, 130, 246, 0.1)'
  }
} as const

// Dark theme color palette
export const darkColors = {
  // Background & Surface colors
  background: '#0F172A',
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  card: '#1E293B',

  // Text colors
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textInverse: '#0F172A',

  // Brand colors
  primary: '#818CF8',
  secondary: '#475569',

  // Semantic colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Finance-specific colors
  income: '#34D399',
  expense: '#F87171',
  transfer: '#60A5FA',
  savings: '#10B981',

  // Form & Input colors
  input: {
    background: '#334155',
    border: '#475569',
    placeholder: '#64748B'
  },

  // Button states
  button: {
    primaryBg: '#818CF8',
    primaryBgDisabled: '#475569',
    primaryText: '#0F172A',
    primaryTextDisabled: '#64748B',

    secondaryBg: 'transparent',
    secondaryBorder: '#475569',
    secondaryText: '#CBD5E1',

    destructiveBg: '#F87171',
    destructiveText: '#0F172A'
  },

  // Border & Divider colors
  border: '#475569',
  borderLight: '#334155',
  borderStrong: '#64748B',

  // Shadow & Elevation
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.2)',
  shadowStrong: 'rgba(0, 0, 0, 0.4)',

  // Tab bar specific colors
  tabBar: {
    background: '#1E293B',
    border: '#475569',
    activeIcon: '#818CF8',
    inactiveIcon: '#94A3B8',
    activeLabel: '#818CF8',
    inactiveLabel: '#94A3B8',
    focusBackground: 'rgba(129, 140, 248, 0.15)'
  },

  // Icon background colors for better semantic meaning
  iconBackground: {
    neutral: '#334155',
    primary: 'rgba(129, 140, 248, 0.15)',
    success: 'rgba(52, 211, 153, 0.15)',
    warning: 'rgba(251, 191, 36, 0.15)',
    error: 'rgba(248, 113, 113, 0.15)',
    info: 'rgba(96, 165, 250, 0.15)'
  }
} as const
