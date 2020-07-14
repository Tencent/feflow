module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['@tencent/eslint-config-tencent', '@tencent/eslint-config-tencent/ts'],
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  overrides: [
    {
      files: ['*.js', '*.vue'],
      rules: {
        // allow paren-less arrow functions
        // 'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'space-before-function-paren': 0,
        'semi': 0,
        'indent': 0,
        'no-unexpected-multiline': 0,
        'no-undef': 0,
        'no-useless-escape': 0,
        'no-new-func': 0,
        'no-unused-expressions': 0,
        'one-var': 0,
        'no-underscore-dangle': 0,
        // 'no-multi-assign': 0,
        'import/no-default-export': 0,
        'import/prefer-default-export': 0,
        // codecc 要求 && 这种放在行首，所以先不添加 prettier
        'operator-linebreak': ['error', 'before', { overrides: { '=': 'none' } }],
        // 'camelcase': 0,
        'no-param-reassign': 0,
        '@typescript-eslint/consistent-type-assertions': 0,
        // 允许使用 require
        '@typescript-eslint/no-require-imports': 0,
        '@typescript-eslint/prefer-optional-chain': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        'prefer-rest-params': 0,
        'no-eval': 0,
        'object-shorthand': 0,
      },
    },
  ]
}
