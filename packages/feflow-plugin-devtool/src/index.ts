import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import Feflow from '@feflow/cli';

enum DevtoolType {
  SCAFFLOAD = '脚手架',
  DEVKIT = '开发套件',
  PLUGIN = '插件',
}

export default (ctx: Feflow) => {
  const { args, commander, logger, root, rootPkg } = ctx;
  const [action] = args._;
  let templatePath: string;

  commander.register('devtool', 'Feflow devtool for better develop a devkit or plugin', async () => {
    switch (action) {
      case 'init': {
        logger.debug('devtool init');
        const { type } = await inquirer.prompt([
          {
            type: 'list',
            name: 'type',
            message: '选择你要接入的类型?',
            choices: [DevtoolType.SCAFFLOAD, DevtoolType.DEVKIT, DevtoolType.PLUGIN],
          },
        ]);

        let message;

        switch (type) {
          case DevtoolType.SCAFFLOAD:
            message = '以 generator- 开头';
            templatePath = path.join(__dirname, './templates/generator-template');
            break;
          case DevtoolType.DEVKIT:
            message = '以 feflow-devkit- 开头';
            templatePath = path.join(__dirname, './templates/devkit-template');
            break;
          case DevtoolType.PLUGIN:
            message = '以 feflow-plugin- 开头';
            templatePath = path.join(__dirname, './templates/plugin-template');
            break;
        }

        const { name } = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: `请输入项目名称(${message})`,
            choices: [DevtoolType.SCAFFLOAD, DevtoolType.DEVKIT, DevtoolType.PLUGIN],
            validate: (name) => {
              switch (type) {
                case DevtoolType.SCAFFLOAD:
                  return /^generator-/.test(name);
                case DevtoolType.DEVKIT:
                  return /^feflow-devkit-/.test(name);
                case DevtoolType.PLUGIN:
                  return /^feflow-plugin-/.test(name);
              }
              return false;
            },
          },
        ]);

        logger.info('Start creating %s', name);
        const destinationPath = path.join(process.cwd(), name);
        fs.copySync(templatePath, destinationPath);
        logger.info('Creating success');
        console.log();
        console.log(chalk.cyan('  cd'), name);
        console.log(`  ${chalk.cyan('fef devtool dev')}`);
        console.log();
        console.log('Happy coding!');
        break;
      }
      case 'dev': {
        logger.info('Start dev');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pkgJson = require(path.join(process.cwd(), 'package.json'));
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const rootPkgJson = require(rootPkg);
        const rootDependenciesPath = path.join(root, 'node_modules');
        const pkgName = pkgJson.name;
        const pkgVersion = pkgJson.version;

        logger.info('Start register %s to feflow home', pkgName);
        if (!rootPkgJson.dependencies[pkgName]) {
          rootPkgJson.dependencies[pkgName] = pkgVersion;
        }
        logger.info('Syncing %s to feflow client system', pkgName);
        fs.writeFileSync(rootPkg, JSON.stringify(rootPkgJson, null, 2));
        fs.copySync(process.cwd(), path.join(rootDependenciesPath, pkgName));

        logger.info('End dev, run feflow commands now!');
        break;
      }
      default:
        return null;
    }
  });
};
