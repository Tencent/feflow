const webpack = require('webpack');
const devConfig = require('./webpack/webpack.dev.config');

module.exports = (ctx) => {
    webpack(devConfig, (err, stats) => {
      if (err) {
        console.log(err);
      }

      console.log(stats.toString({
        chunks: false,
        colors: true,
        children: false
      }));
    });
};
