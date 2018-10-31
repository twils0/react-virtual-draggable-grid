const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const rootDir = path.resolve(__dirname);
const binDir = path.resolve(__dirname, 'bin');
const srcDir = path.resolve(__dirname, 'src');
const nodeModDir = path.resolve(__dirname, 'node_modules');

const config = {
  entry: [path.resolve(srcDir, 'VirtualDraggableGrid.jsx')],
  output: {
    path: binDir,
    filename: 'react-virtual-draggable-grid.min.js',
    libraryTarget: 'umd',
    library: 'default',
  },
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    hotOnly: true,
  },
  resolve: {
    modules: [rootDir, nodeModDir],
    extensions: ['.js', '.jsx'],
  },
  target: 'web',
  externals: {
    'prop-types': {
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types',
      root: 'PropTypes',
    },
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
  },
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
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true,
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin([binDir]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzer(),
  ],
};

module.exports = config;
