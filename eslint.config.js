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
