'use strict'
const path = require('path')
const glob = require('glob')
const chalk = require('chalk')
const mkdirp = require('mkdirp')
const Generator = require('yeoman-generator')
const commandExists = require('command-exists').sync

const config = require('./config')
const pkg = require('../../package.json')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.logger = this.options.log
    for (let optionName in config.options) {
      this.option(optionName, config.options[optionName])
    }

  }

  /**
   * Render templates
   */
  _render(input, output, data) {
    if (!data || Object.keys(data).length === 0) {
      this.fs.copy(
        this.templatePath(input),
        this.destinationPath(output)
      )
      return
    }

    this.fs.copyTpl(
      this.templatePath(input),
      this.destinationPath(output),
      data
    )
  }

  /**
   * Create directories.
   */
  _mkdir(dirname) {
    const done = this.async()
    mkdirp(dirname, function(err) {
      if (err) {
        this.logger.error(err)
        process.exit()
      }
      done()
    })
  }

  /**
   * set destinationRoot
   */
  _setDestRoot(dirname) {
    if (path.basename(this.destinationPath()) !== dirname) {
      this._mkdir(dirname)
      this.destinationRoot(this.destinationPath(dirname))
    }
  }

  /**
   * Interact with user.
   */
  prompting() {
    this.log(`${chalk.green(`\n  欢迎 ${this.user.git.name()} 使用 ${pkg.name}!\n`)}`)

    let prompts = config.prompts.map(item => {
      const ques = Object.assign({}, item)
      Object.keys(ques).forEach(key => {
        if (typeof ques[key] === 'function') {
          ques[key] = (val) => {
            const res = item[key].call(this, val)
            return res
          }
        }
      })
      return ques
    })

    return this.prompt(prompts).then(answers => {
      this.answers = answers
    })
  }

  /**
   * Run private functions
   */
  defaults () {
    // 判断同名项目是否存在，不存在则自动创建并设置为目标根目录
    this._setDestRoot(this.answers.name)
  }

  /**
   * Write templates
   */
  writing() {
    this.logger.info(`${chalk.green('初始化模版...')}\n`)

    const templateData = {
      ...this.answers,
      username: this.user.git.name(),
      date: new Date().toISOString().split('T')[0],
    };

    // render templates
    config.filesToRender.length >= 1 && config.filesToRender.forEach(file => {
      this._render(file.input, file.output, templateData)
    })

    // copy files
    config.filesToCopy.length >= 1 && config.filesToCopy.forEach(file => {
      this._render(file.input, file.output)
    })

    // create directories
    config.dirsToCreate.length >= 1 && config.dirsToCreate.forEach(item => {
      this._mkdir(item)
    })
  }

  /**
   * Install dependencies
   */
  install() {
    this.logger.info(`${chalk.green('初始化git...')}\n`)
    this.spawnCommandSync('git', ['init'])

    this.logger.info(`${chalk.green('安装依赖...')}\n`)
    const hasTnpm = commandExists('tnpm')
    if (hasTnpm) {
      this.spawnCommandSync('tnpm', ['install'])
    } else {
      this.installDependencies({
          npm: true,
          yarn: true,
          bower: false,
        })
      }
    }

  /**
   * Prompt user to start project
   */
  end() {
    this.log(`\n${chalk.green('  Feflow 开发套件初始化完成✨，编码愉快！')}\n`)
  }
}
