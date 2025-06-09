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
