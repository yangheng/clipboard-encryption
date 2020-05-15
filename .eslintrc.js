module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  ignorePatterns: ["node_modules/"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'lines-between-class-members': 'off',
    'semi': 'off',
    'no-plusplus': 'off',
    'eol-last': 'off'
  },
};
