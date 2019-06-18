const webpack = require('webpack');
const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.resolve(__dirname);
const nodeModDir = path.resolve(__dirname, 'node_modules');
const appSrcDir = path.resolve(__dirname, '../src');

const config = (env) => {
  const prod = env.prod === 'true';

  return {
    entry: [path.resolve(rootDir, 'index.jsx')],
    output: {
      path: rootDir,
      // cannot use contenthash with runtime
      filename: chunkData => `[name].[${chunkData.chunk.name === 'runtime' ? 'hash' : 'contenthash'}]${prod
          && '.min'}.js`,
      chunkFilename: `[name].[contenthash]${prod && '.min'}.js`,
      libraryTarget: 'umd',
      library: 'default',
    },
    devtool: 'inline-source-map',
    devServer: {
      historyApiFallback: true,
      hotOnly: true,
    },
    resolve: {
      modules: [rootDir, appSrcDir, nodeModDir],
      extensions: ['.js', '.jsx'],
    },
    target: 'web',
    module: {
      rules: [
        {
          test: /\.(jsx?)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
      ],
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 1,
          },
        },
      },
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: !prod,
          terserOptions: {
            ecma: 6,
            mangle: true,
          },
        }),
      ],
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(rootDir, './src/index.html'),
      }),
    ],
  };
};

module.exports = config;
