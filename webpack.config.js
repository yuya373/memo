const path = require('path');
const webpack = require('webpack');
const devBuild = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    popup: './src/popup.js',
    background: './src/background.js',
    contentScript: './src/contentScript.js',
  },
  output: {
    path: path.join(__dirname, "./extension/src"),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(devBuild ? "development" : "production"),
      },
    })
  ].concat(
    devBuild ? [
    ] : [
      new webpack.optimize.UglifyJsPlugin(),
    ]
  ),
  devtool: devBuild ? "cheap-module-eval-source-map" : false,
};
