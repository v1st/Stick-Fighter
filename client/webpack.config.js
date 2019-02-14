const path = require('path');
const glob = require('glob');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.resolve(__dirname + "/dist"),
    publicPath: '/',
    inline: true,
    port: 8080,
  },
  watch: true,
  devtool: 'source-map'
};