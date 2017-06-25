const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const buildPath = path.join(__dirname, '/public')

const config = {
  entry: {
    main: [
      'babel-polyfill',
      'isomorphic-fetch',
      './app/App.jsx',
    ],
    vendor: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router-dom',
      'redux-saga',
      // 'material-ui', // makes vendor file too large...
    ],
  },
  output: {
    path: buildPath,
    filename: 'bundle.[name].[chunkhash].js',
    chunkFilename: 'bundle.[chunkhash].js',
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [['es2015', { modules: false }], 'stage-0', 'react'],
          },
        }],
      },
      {
        test: /\.json$/,
        use: [{
          loader: 'json-loader',
        }],
      },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'templates/index.ejs',
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
  ],
}

module.exports = config
