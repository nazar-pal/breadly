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
                "Direct imports from lucide-react-native are not allowed. Icons must be wrapped with iconWithClassName to work correctly.\n\n⚠️ CAUTION: Neglecting to wrap icons with iconWithClassName will prevent you from being able to update the color or opacity props via the className prop.\n\nTo add a new icon, follow these steps:\n\n1. Ensure you have the required packages installed:\n   npx expo install react-native-svg lucide-react-native\n\n2. Create a new file in ~/lib/icons/{IconName}.tsx with this structure:\n   ```\n   import { IconName } from 'lucide-react-native';\n   import { iconWithClassName } from './iconWithClassName';\n   iconWithClassName(IconName);\n   export { IconName };\n   ```\n\n3. Import and use your icon from @/lib/icons/IconName\n\nThis ensures consistent styling and proper functionality of color and opacity props across the app."
            }
          ],
          patterns: [
            {
              group: ['lucide-react-native/*'],
              message:
                'Direct imports from lucide-react-native/* are not allowed. Icons must be wrapped with iconWithClassName to work correctly.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['lib/icons/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': 'off'
    }
  }
])
