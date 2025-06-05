// Light theme color palette
export const lightColors = {
  // Background & Surface colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F9FA',
  card: '#FFFFFF',
  cardSecondary: '#FAFBFC',

  // Text colors
  text: '#1A202C',
  textSecondary: '#4A5568',
  textTertiary: '#718096',
  textInverse: '#FFFFFF',

  // Brand colors
  primary: '#6366F1',
  primaryLight: '#A5B4FC',
  primaryDark: '#4338CA',
  secondary: '#E2E8F0',
  accent: '#F59E0B',

  // Semantic colors
  success: '#10B981',
  successLight: '#6EE7B7',
  successDark: '#059669',
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#D97706',
  error: '#EF4444',
  errorLight: '#FCA5A5',
  errorDark: '#DC2626',
  info: '#3B82F6',
  infoLight: '#93C5FD',
  infoDark: '#1D4ED8',

  // Finance-specific colors
  income: '#10B981',
  expense: '#EF4444',
  transfer: '#3B82F6',
  investment: '#8B5CF6',
  savings: '#059669',

  // Interactive states
  link: '#6366F1',
  linkHover: '#4338CA',
  linkVisited: '#7C3AED',

  // Form & Input colors
  input: {
    background: '#FFFFFF',
    border: '#E2E8F0',
    borderFocus: '#6366F1',
    borderError: '#EF4444',
    placeholder: '#A0ADB8',
    disabled: '#F7FAFC'
  },

  // Button states
  button: {
    primaryBg: '#6366F1',
    primaryBgHover: '#4338CA',
    primaryBgPressed: '#3730A3',
    primaryBgDisabled: '#CBD5E0',
    primaryText: '#FFFFFF',
    primaryTextDisabled: '#A0ADB8',

    secondaryBg: 'transparent',
    secondaryBgHover: '#F7FAFC',
    secondaryBgPressed: '#EDF2F7',
    secondaryBorder: '#E2E8F0',
    secondaryText: '#4A5568',

    destructiveBg: '#EF4444',
    destructiveBgHover: '#DC2626',
    destructiveBgPressed: '#B91C1C',
    destructiveText: '#FFFFFF'
  },

  // Border & Divider colors
  border: '#E2E8F0',
  borderLight: '#F7FAFC',
  borderStrong: '#CBD5E0',
  divider: '#E2E8F0',

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
  },

  // Status colors for different states
  status: {
    pending: '#F59E0B',
    processing: '#3B82F6',
    completed: '#10B981',
    cancelled: '#6B7280',
    failed: '#EF4444'
  }
} as const

// Dark theme color palette
export const darkColors = {
  // Background & Surface colors
  background: '#0F172A',
  surface: '#1E293B',
  surfaceSecondary: '#334155',
  card: '#1E293B',
  cardSecondary: '#334155',

  // Text colors
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textInverse: '#0F172A',

  // Brand colors
  primary: '#818CF8',
  primaryLight: '#C7D2FE',
  primaryDark: '#6366F1',
  secondary: '#475569',
  accent: '#FBBF24',

  // Semantic colors
  success: '#34D399',
  successLight: '#6EE7B7',
  successDark: '#10B981',
  warning: '#FBBF24',
  warningLight: '#FCD34D',
  warningDark: '#F59E0B',
  error: '#F87171',
  errorLight: '#FCA5A5',
  errorDark: '#EF4444',
  info: '#60A5FA',
  infoLight: '#93C5FD',
  infoDark: '#3B82F6',

  // Finance-specific colors
  income: '#34D399',
  expense: '#F87171',
  transfer: '#60A5FA',
  investment: '#A78BFA',
  savings: '#10B981',

  // Interactive states
  link: '#818CF8',
  linkHover: '#A5B4FC',
  linkVisited: '#C4B5FD',

  // Form & Input colors
  input: {
    background: '#334155',
    border: '#475569',
    borderFocus: '#818CF8',
    borderError: '#F87171',
    placeholder: '#64748B',
    disabled: '#1E293B'
  },

  // Button states
  button: {
    primaryBg: '#818CF8',
    primaryBgHover: '#A5B4FC',
    primaryBgPressed: '#6366F1',
    primaryBgDisabled: '#475569',
    primaryText: '#0F172A',
    primaryTextDisabled: '#64748B',

    secondaryBg: 'transparent',
    secondaryBgHover: '#334155',
    secondaryBgPressed: '#475569',
    secondaryBorder: '#475569',
    secondaryText: '#CBD5E1',

    destructiveBg: '#F87171',
    destructiveBgHover: '#FCA5A5',
    destructiveBgPressed: '#EF4444',
    destructiveText: '#0F172A'
  },

  // Border & Divider colors
  border: '#475569',
  borderLight: '#334155',
  borderStrong: '#64748B',
  divider: '#475569',

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
  },

  // Status colors for different states
  status: {
    pending: '#FBBF24',
    processing: '#60A5FA',
    completed: '#34D399',
    cancelled: '#9CA3AF',
    failed: '#F87171'
  }
} as const
