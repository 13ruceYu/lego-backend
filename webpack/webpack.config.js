/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const buildFileDest = path.resolve(__dirname, '../app/public');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, '../webpack'),
  entry: './index.js',
  output: {
    path: buildFileDest,
    filename: 'bundle.[hash].js',
    publicPath: '/public/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new HtmlWebpackPlugin({
      file: 'page.nj',
      template: path.resolve(__dirname, './template.html'),
    }),
  ],
};
