const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.entry = path.resolve(__dirname, 'client/src/index.js');
      webpackConfig.output.path = path.resolve(__dirname, 'client/build');
      return webpackConfig;
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'client/public'),
  },
};