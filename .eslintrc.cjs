module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      extends: ['plugin:astro/recommended'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Add specific Astro rules if needed
      },
    },
    {
      files: ['*.jsx', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:jsx-a11y/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/prop-types': 'off', // Disable prop-types validation if not using them
        'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
        'react/jsx-uses-react': 'off', // Not needed with new JSX transform
        'no-unused-vars': ['warn', { varsIgnorePattern: 'React', argsIgnorePattern: '^_' }],
      },
    },
    {
      files: ['*.js', '*.ts'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/no-this-alias': 'off', // Disable for debounce.js
        '@typescript-eslint/triple-slash-reference': 'off', // Disable for env.d.ts
        '@typescript-eslint/no-require-imports': 'off', // Disable if require() is used in JS files
        'no-unused-vars': ['warn', { varsIgnorePattern: 'React', argsIgnorePattern: '^_' }],
      },
    },
    {
      files: ['playwright.config.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off', // Allow require() in Playwright config
      },
    },
    {
      // Enable Vitest globals for test files
      files: ['tests/**/*.js', 'tests/**/*.ts', 'tests/**/*.jsx', 'tests/**/*.tsx'],
      env: {
        // vitest: true, // This is usually enough for vitest globals
        jest: true, // Many vitest projects also set jest: true for compatibility
      },
      rules: {
        'no-undef': 'off', // Turn off no-undef in test files as vitest globals are implicit or handled by jest env
        '@typescript-eslint/no-explicit-any': 'off', // Allow any for test mocks
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn for unused vars, ignore args starting with _
      },
    },
  ],
  plugins: ['react', 'jsx-a11y', '@typescript-eslint'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // General unused vars rule, ignore args starting with _
  },
};
