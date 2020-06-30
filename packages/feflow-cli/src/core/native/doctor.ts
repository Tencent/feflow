import commandLineUsage from 'command-line-usage';
import {  execSync } from 'child_process';
import { getRegistryUrl } from '../../shared/npm';
import axios from 'axios';

module.exports = (ctx: any) => {
    
    async function showToolVersion() {

        const sections = [
            {
                header: 'Your environment information',
                content: 'Show something very important.'
            },
            {
                header: 'Tools Version',
                optionList: [
                    {
                        name: 'node ',
                        typeLabel: '{underline Version:}',
                        description: executeSync('node -v')
                    },
                    {
                        name: 'npm ',
                        typeLabel: '{underline Version:}',
                        description: executeSync('npm -v')
                    },
                    {
                        name: 'tnpm ',
                        typeLabel: '{underline Version:}',
                        description: executeSync('tnpm -v')
                    },
                    {
                        name: 'fef ',
                        typeLabel: '{underline Version:}',
                        description: executeSync('fef -v')
                    },
                    {
                        name: 'Python ',
                        typeLabel: '{underline Version:}',
                        description: executeSync('python -c "import platform; print(platform.python_version())"')
                    }
                ]
            },
            {
                header: 'Proxy config info',
                optionList: [
                    {
                        name: 'http_porxy ',
                        typeLabel: '{underline info:}',
                        description: executeSync('echo $http_proxy')
                    },
                    {
                        name: 'npm_config_porxy ',
                        typeLabel: '{underline info:}',
                        description: executeSync('npm config get proxy')
                    },
                    {
                        name: 'npm_config_registry ',
                        typeLabel: '{underline info:}',
                        description: executeSync('npm config get registry')
                    },
                    {
                        name: 'npm user_config path ',
                        typeLabel: '{underline info:}',
                        description: executeSync('npm config get userconfig')
                    },
                    {
                        name: 'iOA pac ',
                        typeLabel: '{underline info:}',
                        description: '@TODO'
                    }
                ]
            },
            {
                header: 'Network access info',
                optionList: [
                    {
                        name: 'curl npm_config_registry ',
                        typeLabel: '{underline info:}',
                        description: await accessTnpmRegistry()
                    }
                ]
            },
          ];
        const result = commandLineUsage(sections);
        return result;
    }

    function executeSync(command: string): string {
        let resultBuf: Buffer;
        try {
            resultBuf =  execSync(command);
        } catch(e) {
            return e.message;
        }
        
        const result = resultBuf.toString("utf8").trim();
        return result;
    };

    async function accessTnpmRegistry() {
        let tnpmRegistry = await getRegistryUrl('tnpm');
        tnpmRegistry = tnpmRegistry.trim().split('\n');
        tnpmRegistry = tnpmRegistry[tnpmRegistry.length-1];

        try {
            const response = await axios.get(tnpmRegistry);

            if(response.status === 200) {
                return 'access tnpm registry is ok!';
            } else {
                return 'access tnpm registry has error, http code: ${response.statusCode}';
            }
        } catch (error) {
            return 'access tnpm registry has error: ${error}';
        }
        
    }

    ctx.commander.register('doctor', 'environment information', () => {
        showToolVersion().then(result => {
            console.log(result);
        }).catch(error => {
            console.log('error:', error);
        });
    });
};