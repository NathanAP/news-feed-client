import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            // react-hooks v7 moved its flat configs under `.configs.flat`.
            reactHooks.configs.flat['recommended-latest'],
            reactRefresh.configs.vite,
            // Keep formatting concerns with Prettier: disable ESLint stylistic rules.
            eslintConfigPrettier,
        ],
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.browser,
        },
    },
])
