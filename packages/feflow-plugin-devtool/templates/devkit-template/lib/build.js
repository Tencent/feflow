const webpack = require('webpack');
const prodConfig = require('./webpack/webpack.prod.config');

module.exports = (ctx) => {
    webpack(prodConfig, (err, stats) => {
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
