module.exports = {
  extends: ['eslint-config-tencent', 'eslint-config-tencent/ts', 'eslint-config-tencent/prettier'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {},
};
