import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'

export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(224 71.4% 4.1%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(224 71.4% 4.1%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 0%)',
    primary: 'hsl(262.1 83.3% 57.8%)',
    primaryForeground: 'hsl(210 20% 98%)',
    secondary: 'hsl(220 14.3% 95.9%)',
    secondaryForeground: 'hsl(220.9 39.3% 11%)',
    muted: 'hsl(220 14.3% 95.9%)',
    mutedForeground: 'hsl(220 8.9% 46.1%)',
    accent: 'hsl(220 14.3% 95.9%)',
    accentForeground: 'hsl(220.9 39.3% 11%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    destructiveForeground: 'hsl(210 20% 98%)',
    border: 'hsl(220 13% 91%)',
    input: 'hsl(220 13% 91%)',
    ring: 'hsl(262.1 83.3% 57.8%)',
    radius: '0.625rem',
    chart1: 'hsl(12 76% 61%)',
    chart2: 'hsl(173 58% 39%)',
    chart3: 'hsl(197 37% 24%)',
    chart4: 'hsl(43 74% 66%)',
    chart5: 'hsl(27 87% 67%)',
    // Transaction colors
    income: 'hsl(142 76% 36%)',
    expense: 'hsl(0 84.2% 60.2%)',
    transfer: 'hsl(262.1 83.3% 57.8%)',
    savings: 'hsl(186 84% 42%)',
    // Account type colors
    accountPayment: 'hsl(262.1 83.3% 57.8%)', // Purple - matches primary
    accountSavings: 'hsl(186 84% 42%)', // Teal - matches savings
    accountDebt: 'hsl(0 84.2% 60.2%)' // Red - matches destructive
  },
  dark: {
    background: 'hsl(224 71.4% 4.1%)',
    foreground: 'hsl(210 20% 98%)',
    card: 'hsl(224 71.4% 4.1%)',
    cardForeground: 'hsl(210 20% 98%)',
    popover: 'hsl(215 24% 10%)',
    popoverForeground: 'hsl(0 0% 100%)',
    primary: 'hsl(263.4 70% 50.4%)',
    primaryForeground: 'hsl(210 20% 98%)',
    secondary: 'hsl(215 27.9% 16.9%)',
    secondaryForeground: 'hsl(210 20% 98%)',
    muted: 'hsl(215 27.9% 16.9%)',
    mutedForeground: 'hsl(217.9 10.6% 64.9%)',
    accent: 'hsl(215 27.9% 16.9%)',
    accentForeground: 'hsl(210 20% 98%)',
    destructive: 'hsl(0 62.8% 30.6%)',
    destructiveForeground: 'hsl(210 20% 98%)',
    border: 'hsl(215 27.9% 16.9%)',
    input: 'hsl(215 27.9% 16.9%)',
    ring: 'hsl(263.4 70% 50.4%)',
    radius: '0.625rem',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(160 60% 45%)',
    chart3: 'hsl(30 80% 55%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(340 75% 55%)',
    // Transaction colors
    income: 'hsl(142 70% 48%)',
    expense: 'hsl(0 84% 65%)',
    transfer: 'hsl(263.4 70% 50.4%)',
    savings: 'hsl(186 75% 50%)',
    // Account type colors
    accountPayment: 'hsl(263.4 70% 50.4%)', // Purple - matches primary
    accountSavings: 'hsl(186 75% 50%)', // Teal - matches savings
    accountDebt: 'hsl(0 84% 65%)' // Red - matches destructive
  }
}

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground
    }
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground
    }
  }
}
