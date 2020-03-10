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
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
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
    'one-var': 0
  }
}
