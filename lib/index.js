const program = require('commander');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();

program
    .version('0.1.0')
    .option('-init', '工程目录初始化');

/**
 * 工程初始化命令
 */
program
    .command('init')
    .description('工程目录初始化')
    .action(function(env, options){
        /**
         * Lookup方法会在本地查找已经安装过的generator
         */
        yeomanEnv.lookup(() => {
            yeomanEnv.run('@tencent/now-activity', {'skip-install': true}, err => {
                console.log('done');
            });
        });
    });

program.parse(process.argv);