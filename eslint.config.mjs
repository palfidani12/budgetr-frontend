import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import checkFile from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import path from 'eslint-plugin-path';
import playwright from 'eslint-plugin-playwright';
import * as preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import reactPlugin from 'eslint-plugin-react';
import * as reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist', 'playwright-report', 'test-results', 'test-results-docker', 'coverage-reports'],
  },
  {
    settings: {
      'import/resolver': {
        typescript: {},
      },
      'react': {
        version: 'detect',
      },
    },
  },
  eslintConfigPrettier,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  eslint.configs.recommended,
  // eslint-disable-next-line import/no-named-as-default-member
  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        project: 'tsconfig.eslint.json',
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      'check-file': checkFile,
      'prefer-arrow-functions': preferArrowFunctions,
      'react-hooks': reactHooks,
      '@stylistic': stylistic,
      path,
    },
    rules: {
      'quotes': ['error', 'single'],
      'class-methods-use-this': 'warn',
      'max-len': ['warn', { code: 180 }],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': ['error'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': ['error'],
      'no-unused-vars': 'off', // Disable js rule to make sure ts rule applies
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
          allowDefaultCaseForExhaustiveSwitch: true,
          considerDefaultExhaustiveForUnions: true,
          requireDefaultForNonUnion: true,
        },
      ],
      'react/jsx-closing-bracket-location': ['error'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'ignore' }],
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'react/jsx-max-props-per-line': ['error', { when: 'multiline' }],
      'react/jsx-tag-spacing': [
        'error',
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'allow',
        },
      ],
      'react/jsx-wrap-multilines': [
        'error',
        {
          arrow: 'parens-new-line',
        },
      ],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*{.,_}{test,spec,mock}.{ts,tsx}',
            'integ/**/*.{ts,tsx}',
            'e2e/**/*.{ts,tsx}',
            'test/**/*.{ts,tsx}',
            'vite.config.mts',
            'vitest.config.mts',
            'vite-plugins/**',
            'playwright.config.ts',
            'scripts/**',
            'eslint.config.mjs',
            '.testa/**',
          ],
          optionalDependencies: false,
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          /**
           * More than one array item in `groups` indicates a line break between import groups.
           */
          groups: [
            [
              // Packages related to `react`.
              '^react',
              // Things that start with a letter/digit/underscore/@ followed by a letter.
              '^@?\\w',
              // Side effect imports.
              '^\\u0000',
              // @ alias imports.
              '^@/',
              '^@test/',
              '^@integ/',
              '^@e2e/',
              // Imports starting with `../`.
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              // Imports starting with `./`.
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
              // Style imports.
              '^.+\\.?(css)$',
            ],
          ],
        },
      ],
      'check-file/folder-naming-convention': ['error', { 'src/**/*': 'KEBAB_CASE' }],
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/components/**/!(*.spec.){tsx,scss}': 'PASCAL_CASE',
          'src/config/**/*.{ts,tsx}': 'KEBAB_CASE',
          'src/context/**/*.{ts,tsx}': 'KEBAB_CASE',
          'src/hooks/**/*.{ts,tsx}': 'KEBAB_CASE',
          'src/models/**/*.{ts,tsx}': 'PASCAL_CASE',
          'src/services/**/*.{ts,tsx}': 'KEBAB_CASE',
          'src/store/**/*.{ts,tsx}': 'KEBAB_CASE',
          'src/utils/**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: false,
          returnStyle: 'implicit',
          singleReturnOnly: false,
        },
      ],
      'react-hooks/rules-of-hooks': ['error'],
      'react-hooks/exhaustive-deps': ['error'],
      'path/no-relative-imports': 'error',
      'no-console': ['error'],
      'no-restricted-syntax': [
        'error',
        // Enabling ForOfStatement, but keeping the rest of the airbnb defaults.
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries},' +
            'and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
        {
          selector: 'CallExpression[callee.property.name="toHaveScreenshot"]',
          message: '`toHaveScreenshot` is not allowed. Use `toHaveLocatorScreenshots` or `toHaveFullGadgetScreenshots` instead.',
        },
      ],
      // Reconfigure rules from the recommended ruleset
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',

      'no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'functions', 'methods', 'constructors'],
        },
      ],
      'max-classes-per-file': ['error', 1],
      'no-await-in-loop': 'error',
      'no-constant-condition': 'warn',
      'no-param-reassign': [
        'error',
        {
          props: true,
        },
      ],
      '@typescript-eslint/no-floating-promises': ['error'],
      'no-void': [
        'error',
        {
          // Allowing in order to allow for explicitly ignoring floating promises using void
          allowAsStatement: true,
        },
      ],
    },
  },
  {
    files: ['integ/pageobjects/*.ts'],
    rules: {
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        {
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'implicit',
          singleReturnOnly: false,
        },
      ],
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['**/*.e2e.ts', '**/*.integ.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-networkidle': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/expect-expect': 'off',
    },
  },
  {
    files: ['integ/**/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              message: 'Please import expect/test from @integ/base-fixture instead.',
              importNames: ['expect', 'test'],
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        {
          name: 'expect',
          message: 'Please import expect from @integ/base-fixture instead.',
        },
        {
          name: 'test',
          message: 'Please import test from @integ/base-fixture instead.',
        },
      ],
    },
  },
  {
    files: ['.testa/**/*.ts', '.testa/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: '.testa/tsconfig.json',
      },
    },
  },
);
