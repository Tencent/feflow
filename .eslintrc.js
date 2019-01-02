module.exports = {
  "env": {
      "es6": true,
      "node": true
  },
  "parserOptions": {
      "parser": require.resolve('babel-eslint'),
      "ecmaVersion": 6,
      "sourceType": "module"
  },
  "extends": ["eslint:recommended", "ivweb"],
  "rules": {
    "no-param-reassign": 0,
    'indent': [
      2,
      2,
      {
         SwitchCase: 1,
         flatTernaryExpressions: true
      }
  ],
  }
};
