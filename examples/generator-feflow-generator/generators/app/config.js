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
      message: 'Feflow 脚手架名称(*)：',
      name: 'name',
      default: makePrefixName(path.basename(process.cwd()), 'generator-feflow-'),
      filter: str => makePrefixName(str, 'generator-feflow-'),
      validate: str => {
        return /^generator-feflow-.+/.test(str);
      }
    },
    {
      type: 'input',
      message: 'Feflow 脚手架作者(*)：',
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
      message: 'Feflow 脚手架描述(*)：',
      name: 'description',
      validate: str => !!str,
    },
    {
      type: 'input',
      message: 'Feflow 脚手架版本：',
      name: 'version',
      default: '0.0.1',
    },
    {
      type: 'input',
      message: 'Feflow 脚手架仓库地址：',
      name: 'gitRepository',
      default: '',
    },
  ],
  dirsToCreate: [
    'generators',
    'generators/app',
    'generators/app/templates',
    '__tests__',
  ],
  filesToCopy: [
    {
      input: 'CHANGELOG.md',
      output: 'CHANGELOG.md'
    },
    {
      input: 'app/index.js',
      output: 'generators/app/index.js'
    },
    {
      input: 'index.js',
      output: 'generators/index.js'
    },
    {
      input: 'app/templates/dummyfile.txt',
      output: 'generators/app/templates/dummyfile.txt',
    },
    {
      input: 'app/templates/package.json',
      output: 'generators/app/templates/package.json',
    }
  ],
  filesToRender: [
    {
      input: '__tests__/app.js',
      output: '__tests__/app.js'
    },
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
