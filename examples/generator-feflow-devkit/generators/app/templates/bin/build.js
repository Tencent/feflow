const webpack = require('webpack');
const getWebpackConfig = require('../lib/webpack');
const ProjectHelper = require('../lib/utils/projectHelper');

module.exports = (ctx) => {
  const { info, error } = ctx.log;
  const helper = new ProjectHelper(ctx);
  const webpackConfig = getWebpackConfig(helper, 'production');
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      error(err);
    }
    console.log(stats.toString({
      chunks: false,
      colors: true,
      children: false
    }));
  });
};
