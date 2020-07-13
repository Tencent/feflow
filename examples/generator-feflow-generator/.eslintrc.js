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
            allow: ['_this', '_log', '_ret'],
          },
        ],
        'import/no-default-export': 0,
        'import/prefer-default-export': 0,
        // codecc 要求 && 这种放在行首，所以先不添加 prettier
        'operator-linebreak': ['error', 'before', { overrides: { '=': 'none' } }],
        camelcase: 0,
        'no-param-reassign': 0,
        '@typescript-eslint/consistent-type-assertions': 0,
        // 允许使用 require
        '@typescript-eslint/no-require-imports': 0,
        '@typescript-eslint/prefer-optional-chain': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
      },
    },
  ],
};
