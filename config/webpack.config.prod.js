'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./webpack.config.common');
const helpers = require('./helpers');

module.exports = merge.smart(config, {
  devtool: 'source-map',
  entry: './src/index',
  output: {
    path: helpers.root('dist'),
    filename: 'bundle-[chunkhash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      sourceMap: false,
      compress: {
        unused: true,
        comparisons: true,
        conditionals: true,
        if_return: true,
        join_vars: true,
        dead_code: true,
        screw_ie8: true,
        evaluate: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin({
      filename: 'style-[contenthash].css',
      allChunks: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /^((?!\.module).)*\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.module\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            'postcss-loader',
          ],
        }),
      },
    ],
  },
});