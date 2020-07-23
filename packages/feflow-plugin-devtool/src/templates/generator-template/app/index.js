'use strict';
const chalk = require('chalk');
const yosay = require('yosay');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor() {
    super(...arguments);

    this.answers = {};
  }

  /**
   * Print welcome message
   * 打印开始欢迎信息
   */
  initializing() {
    this.log(yosay('Feflow脚手架示例'));
    this.log(chalk.magenta('欢迎您'
        + '这是一款Feflow示例脚手架, Powered by http://www.feflowjs.org/.'
        + '\n'));
  }

  /**
   * Interact with user.
   * 与用户交互阶段
   */
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: '请输入项目名称',
      default: 'my-project',
    }, {
      type: 'input',
      name: 'description',
      message: '请输入项目描述信息',
      default: '这是Feflow示例脚手架创建的项目',
    }, {
      type: 'input',
      name: 'version',
      message: '请输入版本 (1.0.0):',
      default: '1.0.0',
    }]).then((answers) => {
      this.answers = answers;
    });
  }

  /**
   * Storing user configs
   * 如果有需要，在这个阶段执行保存用户配置
   */
  configuring() {

  }

  /**
   * Run private functions
   * 执行自定义函数阶段
   */
  default() {

  }

  /**
   * Copy templates
   * 脚手架模版文件渲染处理
   */
  writing() {
    const { name } = this.answers;
    this.destinationRoot(this.destinationPath(name));

    this.fs.copyTpl(
      `${this.templatePath()}/**/!(_)*`,
      this.destinationPath(),
      this.answers
    );
  }

  /**
   * Where conflicts are handled
   * eg. if files need to be overrided.
   * 统一处理冲突，如要生成的文件已经存在是否覆盖等处理
   */
  conflicts() {

  }

  /**
   * Install dependencies
   * 安装依赖
   */
  install() {
    const { log } = this.options;

    log.info('安装依赖，过程持续1~2分钟');
    this.npmInstall();
  }

  /**
   * Prompt user to start project
   * 提示用户完成初始化
   */
  end() {
    const { name } = this.answers;
    const { log } = this.options;

    log.info('本次初始化过程结束, 请通过以下命令运行项目: ');
    console.log();
    console.log(chalk.cyan('  cd'), name);
    console.log(`  ${chalk.cyan('fef dev')}`);
    console.log();
    log.info('编码愉快!');
  }
};
