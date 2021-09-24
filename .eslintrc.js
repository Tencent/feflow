module.exports = {
  extends: ['eslint-config-tencent', 'eslint-config-tencent/prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {},
  overrides: [
    {
      files: ['*.ts'],
      extends: ['eslint-config-tencent/ts'],
    },
  ],
};
