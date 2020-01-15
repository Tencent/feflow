import inquirer from 'inquirer';


enum DEVTOOL_TYPE {
    SCAFFLOAD = '脚手架',
    DEVKIT = '开发套件',
    PLUGIN = '插件'
}

module.exports = (ctx: any) => {
    const { args, commander, logger } = ctx;
    const [ action ] = args['_'];

    commander.register('devtool', 'Feflow devtool for better develop a devkit or plugin', async () => {
        switch (action) {
            case 'init':
                logger.debug('devtool init');
                const { type } = await inquirer.prompt([{
                    type: 'list',
                    name: 'type',
                    message: '选择你要接入的类型?',
                    choices: [
                        DEVTOOL_TYPE.SCAFFLOAD,
                        DEVTOOL_TYPE.DEVKIT,
                        DEVTOOL_TYPE.PLUGIN
                    ]
                }]);

                let message;

                switch (type) {
                    case DEVTOOL_TYPE.SCAFFLOAD:
                        message = '以 generator- 开头';
                        break;
                    case DEVTOOL_TYPE.DEVKIT:
                        message = '以 feflow-devkit- 开头';
                        break;
                    case DEVTOOL_TYPE.PLUGIN:
                        message = '以 feflow-plugin- 开头';
                        break;
                }

                const { name } = await inquirer.prompt([{
                    type: 'input',
                    name: 'name',
                    message: `请输入项目名称(${ message })`,
                    choices: [
                        DEVTOOL_TYPE.SCAFFLOAD,
                        DEVTOOL_TYPE.DEVKIT,
                        DEVTOOL_TYPE.PLUGIN
                    ],
                    validate: (name) => {
                        switch (type) {
                            case DEVTOOL_TYPE.SCAFFLOAD:
                                return /^generator-/.test(name);
                            case DEVTOOL_TYPE.DEVKIT:
                                return /^feflow-devkit-/.test(name);
                            case DEVTOOL_TYPE.PLUGIN:
                                return /^feflow-plugin-/.test(name);
                        }
                        return false;
                    }
                }]);

                console.log('name', name);

                break;
            case 'dev':
                console.log('dev');
                break;
            default:
                return null;
        }
    });
};