import { safeDump } from '../../shared/yaml';

module.exports = (ctx: any) => {
    const { args, config = {}, configPath } = ctx;
    const [ action, key, value ] = args['_'];

    ctx.commander.register('config', 'Config client', () => {
        switch (action) {
            case 'get':
                console.log(ctx.config[key]);
                break;
            case 'set':
                config[key] = value;
                safeDump(config, configPath);
                break;
            case 'list':
                let str = '';
                for (let prop in config) {
                    str += prop + ' = ' + config[prop] + '\n';
                }
                console.log(str.replace(/\s+$/g, ''));
                break;
            default:
                return null;
        }
    }, [{
        header: `Usage`,
        content: [
            'fef config list                         list all configs',
            'fef config set <key> <value>            set key value',
            'fef config get <key>                    get key value'
        ]
    }, {
        header: `Example`,
        content: [
            'fef config set packageManager npm       set package manager',
            'fef config set disableCheck true        disable check when has new version',
            'fef config set autoUpdate true          autoupdate when has new version',
            'fef config get <key>                    get key config'
        ]
    }]);
};