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
      'react-compiler/react-compiler': 'error'
    }
  }
])
