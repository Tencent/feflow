const merge = require('webpack-merge');

module.exports = (helper, mode) => {
  const baseConfig = require('./webpack.base.config')(helper);

  if (mode === 'development') {
    const devConfig = require('./webpack.dev.config')(helper);
    return merge(baseConfig, devConfig);
  }

  const prodConfig = require('./webpack.prod.config')(helper);
  return merge(baseConfig, prodConfig)
}
