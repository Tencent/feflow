module.exports = (helper) => {
  return {
    mode: 'development',
    devtool: 'cheap-source-map',
    devServer: {
      contentBase: helper.getProjectPath('dist'),
      hot: true,
      host: '127.0.0.1',
      port: 8080,
      stats: 'errors-only',
    },
  }
}
