const { hairlineWidth } = require('nativewind/theme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },

        // Colors migrated from theme/colors.ts
        'old-background': 'var(--old-background)',
        'old-surface': 'var(--old-surface)',
        'old-surface-secondary': 'var(--old-surface-secondary)',
        'old-card': 'var(--old-card)',
        'old-text': 'var(--old-text)',
        'old-text-secondary': 'var(--old-text-secondary)',
        'old-text-inverse': 'var(--old-text-inverse)',
        'old-primary': 'var(--old-primary)',
        'old-secondary': 'var(--old-secondary)',
        'old-success': 'var(--old-success)',
        'old-warning': 'var(--old-warning)',
        'old-error': 'var(--old-error)',
        'old-info': 'var(--old-info)',
        'old-income': 'var(--old-income)',
        'old-expense': 'var(--old-expense)',
        'old-transfer': 'var(--old-transfer)',
        'old-savings': 'var(--old-savings)',
        'old-border': 'var(--old-border)',
        'old-border-light': 'var(--old-border-light)',
        'old-border-strong': 'var(--old-border-strong)',
        'old-shadow': 'var(--old-shadow)',
        'old-shadow-light': 'var(--old-shadow-light)',
        'old-shadow-strong': 'var(--old-shadow-strong)',

        // Input colors
        'old-input': {
          DEFAULT: 'var(--old-input-background)',
          background: 'var(--old-input-background)',
          border: 'var(--old-input-border)',
          placeholder: 'var(--old-input-placeholder)'
        },

        // Button colors
        'old-button': {
          'primary-bg': 'var(--old-button-primary-bg)',
          'primary-bg-disabled': 'var(--old-button-primary-bg-disabled)',
          'primary-text': 'var(--old-button-primary-text)',
          'primary-text-disabled': 'var(--old-button-primary-text-disabled)',
          'secondary-bg': 'var(--old-button-secondary-bg)',
          'secondary-border': 'var(--old-button-secondary-border)',
          'secondary-text': 'var(--old-button-secondary-text)',
          'destructive-bg': 'var(--old-button-destructive-bg)',
          'destructive-text': 'var(--old-button-destructive-text)'
        },

        // Tab bar colors
        'old-tab-bar': {
          background: 'var(--old-tab-bar-background)',
          border: 'var(--old-tab-bar-border)',
          'active-icon': 'var(--old-tab-bar-active-icon)',
          'inactive-icon': 'var(--old-tab-bar-inactive-icon)',
          'active-label': 'var(--old-tab-bar-active-label)',
          'inactive-label': 'var(--old-tab-bar-inactive-label)',
          'focus-background': 'var(--old-tab-bar-focus-background)'
        },

        // Icon background colors
        'old-icon-bg': {
          neutral: 'var(--old-icon-background-neutral)',
          primary: 'var(--old-icon-background-primary)',
          success: 'var(--old-icon-background-success)',
          warning: 'var(--old-icon-background-warning)',
          error: 'var(--old-icon-background-error)',
          info: 'var(--old-icon-background-info)'
        }
      },
      borderWidth: {
        hairline: hairlineWidth()
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
