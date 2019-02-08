const path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './src/index.js',
    './src/gamefiles/sockets.js'
  ],
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