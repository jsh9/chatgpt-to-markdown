const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    "minimizedChatGptToMarkdown": "./src/chatGptToMarkdown.js"
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: false,
          }
        }
      })
    ]
  }
};
