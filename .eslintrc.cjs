module.exports = {
  root: true,
  extends: [
    'airbnb/base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { project: ['./tsconfig.json'] },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': 'off',
  },
  ignorePatterns: ['src/**/*.test.ts', 'src/frontend/generated/*'],
};
