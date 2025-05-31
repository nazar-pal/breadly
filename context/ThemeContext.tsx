import React, { createContext, useContext } from 'react';

// Define color palette
const lightColors = {
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#3B3B3B',
  textSecondary: '#6B6B6B',
  primary: '#6366F1',
  secondary: '#E0DFD7',
  accent: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  border: 'rgba(0, 0, 0, 0.1)',
};

const darkColors = {
  background: '#1F1F1F',
  card: '#2A2A2A',
  text: '#F5F5F5',
  textSecondary: '#AAAAAA',
  primary: '#818CF8',
  secondary: '#3B3B3B',
  accent: '#FBBF24',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  border: 'rgba(255, 255, 255, 0.1)',
};

// Define spacing based on 8pt grid
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Define border radius
const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Define types
type ThemeContextType = {
  isDark: boolean;
  colors: typeof lightColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  themePreference: 'light' | 'dark' | 'system';
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
};

// Create the context
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  spacing,
  borderRadius,
  themePreference: 'system',
  updateTheme: () => {},
});

// Define props type for the provider
type ThemeProviderProps = {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  themePreference: 'light' | 'dark' | 'system';
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
};

// Create the provider component
export const ThemeProvider = ({
  children,
  theme,
  updateTheme,
  themePreference,
}: ThemeProviderProps) => {
  const isDark = theme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors,
        spacing,
        borderRadius,
        themePreference,
        updateTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the context
export const useTheme = () => useContext(ThemeContext);