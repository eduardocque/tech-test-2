import js from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import importEslint from 'eslint-plugin-import';

export default tsEslint.config({
  extends: [js.configs.recommended, ...tsEslint.configs.strictTypeChecked],
  files: ['**/*.{ts,tsx}'],
  ignores: ['node_modules', 'dist', 'coverage', '.yarn/*'],
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
    prettier
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        disallowTypeAnnotations: false,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports'
      }
    ],
    '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    'no-var': 'error',
    curly: 'error',
    // indent: ['warn', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: false }],
    // semi: ['warn', 'never'],
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
