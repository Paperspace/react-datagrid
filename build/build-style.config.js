'use strict';

var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    'index': './index.styl',
    'index-no-normalize': './style/index.styl'
  },
  output: {
    filename: './[name].css'
  },
  module: {
    loaders: [
        {
          test: /\.styl$/,
          loader: 'style-loader!css-loader!autoprefixer-loader!stylus-loader',
        }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './[name].css',
      allChunks: true,
    }),
  ]
}
