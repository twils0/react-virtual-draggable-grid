const config = {
  extends: ['airbnb'],
  parser: 'babel-eslint',
  plugins: ['react', 'import', 'babel'],
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  rules: {
    'no-console': ['warn', { allow: ['error'] }],
    'jsx-a11y/no-noninteractive-element-interactions': [
      'error',
      {
        handlers: ['onClick', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'],
      },
    ],
    'function-paren-newline': ['error', 'consistent'],
    'react/no-this-in-sfc': 'off',
    'react/destructuring-assignment': 'off',
    'prefer-promise-reject-errors': 'off',
    'react/forbid-prop-types': 'off',
    'no-mixed-operators': [
      'error',
      {
        groups: [
          ['%', '**'],
          ['%', '+'],
          ['%', '-'],
          ['%', '*'],
          ['%', '/'],
          ['**', '+'],
          ['**', '-'],
          ['**', '*'],
          ['**', '/'],
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: false,
      },
    ],
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
};

module.exports = config;
