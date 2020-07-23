const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server')
const getWebpackConfig = require('../lib/webpack');
const ProjectHelper = require('../lib/utils/projectHelper');

module.exports = (ctx) => {
  const { info, error } = ctx.log;
  const helper = new ProjectHelper(ctx);
  const webapckConfig = getWebpackConfig(helper, 'development');
  const compiler = webpack(webapckConfig, (err, stats) => {
    if (err) {
      error(err);
    }

    console.log(stats.toString({
      chunks: false,
      colors: true,
      children: false
    }));
  });

  const server = new WebpackDevServer(compiler, webapckConfig.devServer)
  const host = webapckConfig.devServer.host
  const port = webapckConfig.devServer.port
  server.listen(port, host, () => {
    info(`Listen to ${host}:${port}`)
  })
};
