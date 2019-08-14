const config = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    'react-hot-loader/babel',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-react-jsx-source',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ],
};

module.exports = config;
