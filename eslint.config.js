import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/api-sdk/**',  // Ignore generated API SDK files
      'logs/**',
      '*.log',
      '.env*',
      'coverage/**'
    ]
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Code complexity rules - more reasonable limits
      'complexity': ['warn', { max: 15 }],
      'max-lines': ['warn', { max: 500, skipComments: true, skipBlankLines: true }],
      'max-lines-per-function': ['warn', { max: 100, skipComments: true, skipBlankLines: true }],
      'max-params': ['warn', { max: 5 }],
      
      // TypeScript rules - less strict for now
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
      }],
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      '@typescript-eslint/explicit-member-accessibility': 'off',  // Not needed for React
      
      // React specific
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
