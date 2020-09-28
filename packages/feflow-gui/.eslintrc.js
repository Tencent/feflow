module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  extends: ['plugin:vue/vue3-recommended', '@tencent/eslint-config-tencent'],
  globals: {
    __static: true,
  },
  plugins: [
    'vue',
  ],
  overrides: [
    {
      files: ['*.js', '*.vue'],
      rules: {
        // allow paren-less arrow functions
        // 'arrow-parens': 0,
        // allow async-await
        // 'generator-star-spacing': 0,
        // // allow debugger during development
        // 'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // 'space-before-function-paren': 0,
        // 'semi': 0,
        // 'indent': 0,
        // 'no-unexpected-multiline': 0,
        // 'no-undef': 0,
        'no-useless-escape': 0,
        'new-cap': 0,
        'no-new-func': 0,
        'no-unused-expressions': 0,
        // 'one-var': 0,
        'no-underscore-dangle': 0,
        // 'no-multi-assign': 0,
        'import/no-default-export': 0,
        'import/prefer-default-export': 0,
        // codecc 要求 && 这种放在行首，所以先不添加 prettier
        'operator-linebreak': ['error', 'before', { overrides: { '=': 'none' } }],
        // 'camelcase': 0,
        'no-param-reassign': 0,
        'prefer-rest-params': 0,
        'no-eval': 0,
        'object-shorthand': 0,
        'vue/no-deprecated-slot-attribute': 0,
        'vue/no-deprecated-v-on-native-modifier': 0,
        'vue/custom-event-name-casing': 0,
        'vue/require-valid-default-prop': 0,
        'vue/no-deprecated-filter': 0,
        'vue/component-tags-order': 0,
        'vue/require-prop-types': 0,
        'vue/no-v-html': 0,
        'vue/order-in-components': 0,
        'vue/require-default-prop': 0,
        'vue/this-in-template': 0,
        'vue/no-template-shadow': 0,
      },
    },
  ],
};
