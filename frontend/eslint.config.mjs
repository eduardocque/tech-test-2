import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier';
// import storybook from 'eslint-plugin-storybook';
import importEslint from 'eslint-plugin-import';
import nextPlugin from '@next/eslint-plugin-next';

// const path = require('path');

export default tsEslint.config({
  extends: [js.configs.recommended, ...tsEslint.configs.strictTypeChecked],
  files: ['**/*.{ts,tsx}'],
  ignores: ['node_modules', 'dist', 'coverage', '.yarn/*', '.next'],
  languageOptions: {
    ecmaVersion: 2023,
    globals: globals.browser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ['.storybook/*.ts', '.storybook/*.tsx'],
        defaultProject: './tsconfig.json'
      },
      tsconfigRootDir: import.meta.dirname
    }
  },
  plugins: {
    import: importEslint,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    react,
    prettier,
    jsxRuntime: react.configs.flat['jsx-runtime'],
    '@next/next': nextPlugin
    // storybook
  },
  rules: {
    // Next.js Rules
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
    // React Hooks rules
    ...reactHooks.configs.recommended.rules,
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        disallowTypeAnnotations: false,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports'
      }
    ],
    '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'no-var': 'error',
    curly: 'error',
    // indent: ['warn', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: false }],
    // semi: ['warn', 'never'],
    'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
    'prettier/prettier': ['warn', { trillingComma: 'es5' }],
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
        pathGroups: [
          { pattern: '@icons/**', group: 'internal' },
          { pattern: '@components/**', group: 'internal' },
          { pattern: '@hooks/**', group: 'internal' },
          { pattern: '@/**', group: 'internal' } // , position: 'before'
        ],
        pathGroupsExcludedImportTypes: ['type'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always'
      }
    ]
  }
});

// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
//   {
//     ignores: [
//       "node_modules/**",
//       ".next/**",
//       "out/**",
//       "build/**",
//       "next-env.d.ts",
//     ],
//   },
// ];

// export default eslintConfig;
