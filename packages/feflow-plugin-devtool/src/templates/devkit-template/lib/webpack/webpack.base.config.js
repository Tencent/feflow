module.exports = (helper) => {
  return {
    entry: helper.getProjectPath('main.js'),
    output: {
      path: helper.getProjectPath('dist'),
      filename: 'bundle.js',
    }
  }
}
