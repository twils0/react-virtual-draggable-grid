const config = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-react-jsx-source',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ],
  env: {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        'babel-plugin-dynamic-import-node',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-react-jsx-source',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
      ],
    },
  },
};

module.exports = config;
