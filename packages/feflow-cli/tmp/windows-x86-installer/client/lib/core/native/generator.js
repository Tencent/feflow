"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var inquirer_1 = __importDefault(require("inquirer"));
var path_1 = __importDefault(require("path"));
var yeoman_environment_1 = __importDefault(require("yeoman-environment"));
var loadGenerator = function (root, rootPkg) { return new Promise(function (resolve, reject) {
    fs_1.default.readFile(rootPkg, 'utf8', function (err, data) {
        if (err) {
            reject(err);
        }
        else {
            var json = JSON.parse(data);
            var deps = json.dependencies || json.devDependencies || {};
            var generators = Object.keys(deps)
                .filter(function (name) {
                if (!/^generator-|^@[^/]+\/generator-/.test(name)) {
                    return false;
                }
                var generatorPath = path_1.default.join(root, 'node_modules', name);
                return fs_1.default.existsSync(generatorPath);
            })
                .map(function (name) {
                var generatorPkgPath = path_1.default.join(root, 'node_modules', name, 'package.json');
                var generatorPkgData = fs_1.default.readFileSync(generatorPkgPath, 'utf8');
                var generatorPkgJson = JSON.parse(generatorPkgData);
                var desc = generatorPkgJson.description;
                return { name: name, desc: desc };
            });
            resolve(generators);
        }
    });
}); };
var run = function (ctx, name) {
    var root = ctx.root;
    var yeomanEnv = yeoman_environment_1.default.createEnv();
    var generatorEntry = path_1.default.join(root, 'node_modules', name, 'app/index.js');
    if (!fs_1.default.existsSync(generatorEntry)) {
        generatorEntry = path_1.default.join(root, 'node_modules', name, 'generators', 'app/index.js');
    }
    yeomanEnv.register(require.resolve(generatorEntry), name);
    yeomanEnv.run(name, ctx, function (err) {
        if (err) {
            ctx.logger.error(err);
        }
        else {
            ctx.logger.debug('create project success!');
        }
    });
};
module.exports = function (ctx) {
    ctx.commander.register('init', 'Create a new project', function () {
        var root = ctx.root, rootPkg = ctx.rootPkg, args = ctx.args;
        var generator = args.generator;
        var chooseGenerator = generator;
        var isValidGenerator = false;
        loadGenerator(root, rootPkg).then(function (generators) {
            var options = generators.map(function (item) {
                if (item.name === chooseGenerator) {
                    isValidGenerator = true;
                }
                return item.desc;
            });
            if (isValidGenerator) {
                return run(ctx, chooseGenerator);
            }
            if (generators.length) {
                inquirer_1.default
                    .prompt([
                    {
                        type: 'list',
                        name: 'desc',
                        message: '您想要创建哪种类型的工程?',
                        choices: options,
                    },
                ])
                    .then(function (answer) {
                    var name;
                    // eslint-disable-next-line array-callback-return
                    generators.map(function (item) {
                        if (item.desc === answer.desc) {
                            // eslint-disable-next-line prefer-destructuring
                            name = item.name;
                        }
                    });
                    ctx.reporter.report('init', name);
                    name && run(ctx, name);
                });
            }
            else {
                ctx.logger.warn('You have not installed a template yet, '
                    + ' please use install command. Guide: https://github.com/Tencent/feflow');
            }
        });
    });
};
//# sourceMappingURL=generator.js.map