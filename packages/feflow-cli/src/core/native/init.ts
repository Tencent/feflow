import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import yeoman from 'yeoman-environment';

import Feflow from '../';
import { install } from '../../shared/npm';

const loadGenerator = (
  root: string,
  rootPkg: string,
) => new Promise<{ name: string; desc: string }[]>((resolve, reject) => {
  fs.readFile(rootPkg, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      const json = JSON.parse(data);
      const deps = json.dependencies || json.devDependencies || {};
      const generators = Object.keys(deps)
        .filter((name) => {
          if (!/^generator-|^@[^/]+\/generator-/.test(name)) {
            return false;
          }
          const generatorPath = path.join(root, 'node_modules', name);
          return fs.existsSync(generatorPath);
        })
        .map((name) => {
          const generatorPkgPath = path.join(root, 'node_modules', name, 'package.json');
          const generatorPkgData = fs.readFileSync(generatorPkgPath, 'utf8');
          const generatorPkgJson = JSON.parse(generatorPkgData);
          const desc = generatorPkgJson.description as string;

          return { name, desc };
        });
      resolve(generators);
    }
  });
});

const run = (ctx: Feflow, name: string) => {
  const { root } = ctx;
  const yeomanEnv = yeoman.createEnv();
  let generatorEntry = path.join(root, 'node_modules', name, 'app/index.js');

  if (!fs.existsSync(generatorEntry)) {
    generatorEntry = path.join(root, 'node_modules', name, 'generators', 'app/index.js');
  }
  yeomanEnv.register(require.resolve(generatorEntry), name);
  yeomanEnv.run(name, ctx, (err) => {
    ctx.reporter?.reportInitResult();
    if (err) {
      ctx.logger.error(err);
    } else {
      ctx.logger.debug('create project success!');
    }
  });
};

export default (ctx: Feflow) => {
  ctx.commander.register('init', 'Create a new project', () => {
    const { root, rootPkg, args } = ctx;
    const { generator } = args;
    loadGenerator(root, rootPkg).then(async (generators) => {
      // feflow init 简化逻辑直接安装并使用脚手架
      if (generator && /^generator-|^@[^/]+\/generator-/.test(generator)) {
        const isGeneratorInstalled = generators.some(item => item.name === generator);
        if (generators.length && isGeneratorInstalled) {
          run(ctx, generator);
          return;
        }
        const askIfInstallGenerator = [
          {
            type: 'confirm',
            name: 'ifInstall',
            message: `You have not installed the generator ${generator}，if you want to install and use ?`,
            default: true,
          },
        ];
        const answer = await inquirer.prompt(askIfInstallGenerator);
        if (answer.ifInstall) {
          const { packageManager } = ctx.config || {};
          if (!packageManager) {
            ctx.logger.error('cannot find \'packageManager\' from config');
            return;
          }
          install(packageManager, ctx.root, 'install', generator, false).then(() => {
            ctx.logger.info('install success');
            run(ctx, generator);
          });
          return;
        }
      }
      const options = generators.map(item => item.desc);
      if (generators.length) {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'desc',
              message: '您想要创建哪种类型的工程?',
              choices: options,
            },
          ])
          .then((answer: any) => {
            let name;
            generators.forEach((item: any) => {
              if (item.desc === answer.desc) {
                name = item.name;
              }
            });
            ctx.reporter.report('init', name);
            name && run(ctx, name);
          });
      } else {
        ctx.logger.warn('You have not installed a template yet, '
            + ' please use install command. Guide: https://github.com/Tencent/feflow');
      }
    });
  });
};
