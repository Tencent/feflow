import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import yeoman from 'yeoman-environment';
import { install } from '../../shared/npm';

const loadGenerator = (root: string, rootPkg: string) => {
    return new Promise<any>((resolve, reject) => {
        fs.readFile(rootPkg, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const json = JSON.parse(data);
                const deps = json.dependencies || json.devDependencies || {};
                const generators = Object.keys(deps).filter((name) => {
                    if (!/^generator-|^@[^/]+\/generator-/.test(name)) {
                        return false;
                    }
                    const generatorPath = path.join(root, 'node_modules', name);
                    return fs.existsSync(generatorPath);
                }).map((name) => {
                    const generatorPkgPath = path.join(root, 'node_modules', name, 'package.json');
                    const generatorPkgData = fs.readFileSync(generatorPkgPath, 'utf8');
                    const generatorPkgJson = JSON.parse(generatorPkgData);
                    const desc = generatorPkgJson.description;

                    return { name, desc };
                });
                resolve(generators);
            }
        });
    });
};

const run = (ctx: any, name: string) => {
    const root = ctx.root;
    const yeomanEnv = yeoman.createEnv();
    let generatorEntry = path.join(root, 'node_modules', name, 'app/index.js');

    if (!fs.existsSync(generatorEntry)) {
        generatorEntry = path.join(root, 'node_modules', name, 'generators', 'app/index.js');
    }
    yeomanEnv.register(require.resolve(generatorEntry), name);
    yeomanEnv.run(name, ctx, err => {
        if (err) {
            ctx.logger.error(err);
        } else {
            ctx.logger.debug('create project success!');
        }
    });
}

module.exports = (ctx: any) => {
    ctx.commander.register('init', 'Create a new project', () => {
        const { root, rootPkg } = ctx;
        const name = ctx.args._.shift() || '';
        if (name && /^generator-|^@[^/]+\/generator-/.test(name)) {
            console.log('检测插件是否本地存在');
            loadGenerator(root, rootPkg).then((generators: any) => {
                const isGeneratorInstalled = generators.some((item: any) => {
                    return item.name === name
                });
                // 如果本地已经安装插件则进入激活逻辑
                if (generators.length && isGeneratorInstalled) {
                    run(ctx, name);
                    return;
                } else {
                    const packageManager = ctx.config && ctx.config.packageManager;
                    install(
                        packageManager,
                        ctx.root,
                        'install',
                        name,
                        false,
                        true
                    ).then(() => {
                        ctx.logger.info('install success');
                        run(ctx, name);
                    });
                    return;
                }
            });
            return;
        }

        loadGenerator(root, rootPkg).then((generators: any) => {
            const options = generators.map((item: any) => {
                return item.desc
            });
            if (generators.length) {
                inquirer.prompt([{
                    type: 'list',
                    name: 'desc',
                    message: '您想要创建哪种类型的工程?',
                    choices: options
                }]).then((answer: any) => {
                    let name;

                    generators.map((item: any) => {
                        if (item.desc === answer.desc) {
                            name = item.name;
                        }
                    });

                    name && run(ctx, name);
                });
            } else {
                ctx.logger.warn(
                    'You have not installed a template yet, ' +
                    ' please use install command. Guide: https://github.com/Tencent/feflow'
                );
            }
        });
    });
};