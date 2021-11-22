module.exports = {
  extends: ['eslint-config-tencent', 'eslint-config-tencent/ts', 'eslint-config-tencent/prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  plugins: ['mocha', 'chai-friendly'],
  rules: {},
  overrides: [
    {
      files: ['*.spec.ts'],
      extends: ['plugin:mocha/recommended', 'plugin:chai-friendly/recommended'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
        'prefer-arrow-callback': 'off',
      },
    },
  ],
};
