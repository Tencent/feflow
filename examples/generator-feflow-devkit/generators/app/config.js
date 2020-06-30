'use strict';
const path = require('path')
const _ = require('lodash')

/**
 * 生成指定前缀的名称
 * @param {string} name    原始名称
 * @param {string} prefix  指定前缀
 */
function makePrefixName(name = '', prefix = 'generator-') {
  name = _.kebabCase(name)
  name = name.indexOf(prefix) === 0 ? name : prefix + name
  return name
}

/**
 * 获取 Git 用户名称
 */
const getGitUserName = () => {
  return this.user.git.name() || ''
}

module.exports = {
  prompts: [
    {
      type: 'input',
      message: 'Feflow 开发套件名称(*)：',
      name: 'name',
      default: makePrefixName(path.basename(process.cwd()), 'feflow-devkit-'),
      filter: str => makePrefixName(str, 'feflow-devkit-'),
      validate: str => {
        return /^feflow-devkit-.+/.test(str);
      }
    },
    {
      type: 'input',
      message: 'Feflow 开发套件作者(*)：',
      name: 'author',
      default: function() {
        try {
          return this.user.git.name()
        } catch {
          return ''
        }
      },
    },
    {
      type: 'input',
      message: 'Feflow 开发套件描述(*)：',
      name: 'description',
      validate: str => !!str,
    },
    {
      type: 'input',
      message: 'Feflow 开发套件版本：',
      name: 'version',
      default: '0.0.1',
    },
    {
      type: 'input',
      message: 'Feflow 开发套件仓库地址：',
      name: 'gitRepository',
      default: '',
    },
  ],
  dirsToCreate: [
    'bin',
    'lib',
    'lib/utils',
  ],
  filesToCopy: [
    {
      input: 'bin/build.js',
      output: 'bin/build.js'
    },
    {
      input: 'bin/dev.js',
      output: 'bin/dev.js'
    },
    {
      input: 'lib/utils/projectHelper.js',
      output: 'lib/utils/projectHelper.js'
    },
    {
      input: 'lib/webpack/index.js',
      output: 'lib/webpack/index.js'
    },
    {
      input: 'lib/webpack/webpack.base.config.js',
      output: 'lib/webpack/webpack.base.config.js'
    },
    {
      input: 'lib/webpack/webpack.dev.config.js',
      output: 'lib/webpack/webpack.dev.config.js'
    },
    {
      input: 'lib/webpack/webpack.prod.config.js',
      output: 'lib/webpack/webpack.prod.config.js'
    },
    {
      input: 'devkit.json',
      output: 'devkit.json'
    },
  ],
  filesToRender: [
    {
      input: '_editorconfig',
      output: '.editorconfig'
    },
    {
      input: '_gitignore',
      output: '.gitignore'
    },
    {
      input: '_eslintrc',
      output: '.eslintrc.js'
    },
    {
      input: '_eslintignore',
      output: '.eslintignore'
    },
    {
      input: '_README',
      output: 'README.md'
    },
    {
      input: '_LICENSE',
      output: 'LICENSE'
    },
    {
      input: '_package',
      output: 'package.json'
    },
  ]
}
