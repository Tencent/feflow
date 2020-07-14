module.exports = {
  extends: ['@tencent/eslint-config-tencent', '@tencent/eslint-config-tencent/ts'],
  overrides: [
    {
      files: ['*.js', '*.ts'],
      rules: {
        'no-underscore-dangle': [
          'error',
          {
            enforceInMethodNames: false,
            allowAfterThis: true,
            allow: ['_this', '__importDefault', '__esModule', '__read', '__values', '_a', '__awaiter', '__generator', '__assign', '_args', '_obj'],
          },
        ],
        // 'no-multi-assign': 0,
        'import/no-default-export': 0,
        'import/prefer-default-export': 0,
        // codecc 要求 && 这种放在行首，所以先不添加 prettier
        'operator-linebreak': ['error', 'before', { overrides: { '=': 'none' } }],
        camelcase: 0,
        'no-param-reassign': 0,
        'no-case-declarations': 0,
        '@typescript-eslint/consistent-type-assertions': 0,
        // 允许使用 require
        '@typescript-eslint/no-require-imports': 0,
        '@typescript-eslint/prefer-optional-chain': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/member-ordering': 0,
        '@typescript-eslint/no-unused-expressions': 0,
      },
    },
  ],
  "env": {
    "commonjs": true,
    "node": true,
    "mocha": true,
    "jest": true,
  },
};
