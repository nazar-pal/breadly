// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')
const eslintPluginReactCompiler = require('eslint-plugin-react-compiler')

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*'],
    plugins: {
      'react-compiler': eslintPluginReactCompiler
    },
    rules: {
      'react-compiler/react-compiler': 'warn',
      'prettier/prettier': 'warn'
    }
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lucide-react-native',
              importNames: ['*'],
              message:
                "Direct imports from lucide-react-native are not allowed. Use the Icon component from components/ui/icon-by-name.tsx instead.\n\n⚠️ CAUTION: Direct lucide imports will not work correctly with our styling system and may cause inconsistent theming.\n\nInstead of:\n  import { Heart } from 'lucide-react-native'\n\nUse:\n  import { Icon } from '@/components/ui/icon-by-name'\n  <Icon name=\"Heart\" size={24} className=\"text-red-500\" />\n\nThe Icon component provides:\n• Automatic icon resolution with fallback handling\n• Consistent styling via className prop\n• Proper integration with the app's theming system\n• TypeScript autocomplete for all available icon names"
            }
          ],
          patterns: [
            {
              group: ['lucide-react-native/*'],
              message:
                'Direct imports from lucide-react-native/* are not allowed. Use the Icon component from components/ui/icon-by-name.tsx instead.'
            }
          ]
        }
      ],
      // Warn about .toISOString() usage which can cause date-shifting issues
      // for date-only fields. This rule catches common patterns and educates devs.
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "CallExpression[callee.property.name='toISOString'] > MemberExpression[property.name='split']",
          message:
            "⚠️ DATE SHIFT RISK: .toISOString().split('T')[0] can shift dates!\n\nFor date-only fields (tx_date, start_date, due_date), use:\n  import { toDateString } from '@/data/date-utils'\n  toDateString(date) // Returns 'YYYY-MM-DD' safely\n\nFor timestamps (created_at, updated_at), .toISOString() is safe.\n\nSee: src/data/DatabaseDesignGuidelines.md § Date and Timestamp Handling"
        },
        {
          selector:
            "MemberExpression[property.name='toISOString']:has(MemberExpression[property.name='split'])",
          message:
            "⚠️ DATE SHIFT RISK: .toISOString().split('T')[0] can shift dates!\n\nFor date-only fields (tx_date, start_date, due_date), use:\n  import { toDateString } from '@/data/date-utils'\n  toDateString(date) // Returns 'YYYY-MM-DD' safely\n\nFor timestamps (created_at, updated_at), .toISOString() is safe.\n\nSee: src/data/DatabaseDesignGuidelines.md § Date and Timestamp Handling"
        }
      ]
    }
  },
  {
    files: ['src/lib/icons/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': 'off'
    }
  }
])
