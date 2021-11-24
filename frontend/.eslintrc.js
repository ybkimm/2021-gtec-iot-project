/* eslint quote-props: ['error', 'always'] */

module.exports = {
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'standard'
  ],
  'parser': '@typescript-eslint/parser',
  'plugins': [
    '@typescript-eslint'
  ],
  'env': {
    'browser': true,
    'node': true
  },
  'rules': {
    'no-use-before-define': 'off',
    'import/order': ['error', { 'alphabetize': { 'order': 'asc' } }],
    'operator-linebreak': ['error', 'before'],
    '@typescript-eslint/no-use-before-define': 'error',
    'indent': ['error', 2, { 'offsetTernaryExpressions': false }]
  }
}
