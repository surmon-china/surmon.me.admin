import globals from 'globals'
import { defineConfig } from 'eslint/config'
import pluginJs from '@eslint/js'
import pluginTs from 'typescript-eslint'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginReact from 'eslint-plugin-react'

const rules = {
  'prettier/prettier': ['error'],
  'react/display-name': 0,
  '@typescript-eslint/ban-ts-comment': 0,
  '@typescript-eslint/explicit-module-boundary-types': 0,
  '@typescript-eslint/no-explicit-any': 0,
  '@typescript-eslint/no-inferrable-types': 0,
  '@typescript-eslint/no-non-null-assertion': 0,
  '@typescript-eslint/no-unused-expressions': 0,
  '@typescript-eslint/no-unused-vars': 0,
  '@typescript-eslint/no-non-null-asserted-optional-chain': 0
}

export default defineConfig([
  { files: ['**/*.{ts,tsx,js,jsx}'] },
  { ignores: ['node_modules', 'dist', 'public'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  pluginPrettier,
  {
    // https://github.com/vitejs/vite/blob/main/packages/create-vite/template-react-ts/eslint.config.js
    // https://github.com/jsx-eslint/eslint-plugin-react/issues/3556
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: 'detect' } }
  },
  { rules }
])
