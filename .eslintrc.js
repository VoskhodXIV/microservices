// https://eslint.org/docs/latest/user-guide/configuring/configuration-files
// https://sydrawat.gitbook.io/react/extension/project-setup
module.exports = {
  extends: ['airbnb-base', 'prettier', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  env: {
    mocha: true,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-undef': 'off',
    'no-shadow': 'off',
    'new-cap': 'off',
    'consistent-return': 'off',
    'comma-dangle': 'off',
    camelcase: 'off',
  },
}
