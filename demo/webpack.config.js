const webpack = require('webpack');
const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.resolve(__dirname);
const nodeModDir = path.resolve(__dirname, 'node_modules');
const appSrcDir = path.resolve(__dirname, '../src');

const config = {
  entry: [path.resolve(rootDir, 'index.jsx')],
  output: {
    path: rootDir,
    filename: 'react-virtual-draggable-grid-demo.min.js',
    libraryTarget: 'umd',
    library: 'default',
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    hotOnly: true,
    inline: true,
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
    ],
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          filename: 'vendors-demo.min.js',
          chunks: 'all',
        },
      },
    },
    // minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'index.html'),
    }),
  ],
};

module.exports = config;