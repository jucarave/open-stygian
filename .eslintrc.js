module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended', 
    'plugin:@typescript-eslint/eslint-recommended', 
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'prefer-const': 'error',
    'no-var': 'error',
    'quotes': ['error', 'single'],
    '@typescript-eslint/no-empty-function': 0
  },
  env: {
    node: true
  }
};
