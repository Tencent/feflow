import { execSync } from 'child_process';
import axios from 'axios';
import commandLineUsage from 'command-line-usage';
import Feflow from '../';
import { getRegistryUrl } from '../../shared/npm';

export default (ctx: Feflow) => {
  async function showToolVersion() {
    const sections = [
      {
        header: 'Your environment information',
        content: 'Show something very important.',
      },
      {
        header: 'Tools Version',
        optionList: [
          {
            name: 'node ',
            typeLabel: '{underline Version:}',
            description: executeSync('node -v'),
          },
          {
            name: 'npm ',
            typeLabel: '{underline Version:}',
            description: executeSync('npm -v'),
          },
          {
            name: 'tnpm ',
            typeLabel: '{underline Version:}',
            description: executeSync('tnpm -v'),
          },
          {
            name: 'fef ',
            typeLabel: '{underline Version:}',
            description: executeSync('fef -v'),
          },
          {
            name: 'Python ',
            typeLabel: '{underline Version:}',
            description: executeSync('python -c "import platform; print(platform.python_version())"'),
          },
        ],
      },
      {
        header: 'Proxy config info',
        optionList: [
          {
            name: 'http_proxy ',
            typeLabel: '{underline info:}',
            description: executeSync('echo $http_proxy'),
          },
          {
            name: 'npm_config_proxy ',
            typeLabel: '{underline info:}',
            description: executeSync('npm config get proxy'),
          },
          {
            name: 'npm_config_registry ',
            typeLabel: '{underline info:}',
            description: executeSync('npm config get registry'),
          },
          {
            name: 'npm user_config path ',
            typeLabel: '{underline info:}',
            description: executeSync('npm config get userconfig'),
          },
          {
            name: 'iOA pac ',
            typeLabel: '{underline info:}',
            description: '@TODO',
          },
        ],
      },
      {
        header: 'Network access info',
        optionList: [
          {
            name: 'curl npm_config_registry ',
            typeLabel: '{underline info:}',
            description: await accessTnpmRegistry(),
          },
        ],
      },
    ];
    return commandLineUsage(sections);
  }

  function executeSync(command: string): string {
    let resultBuf;
    try {
      resultBuf = execSync(command, { windowsHide: true });
    } catch (e) {
      return e instanceof Error ? e.message : JSON.stringify(e);
    }

    return resultBuf.toString('utf8').trim();
  }

  async function accessTnpmRegistry() {
    let tnpmRegistry = await getRegistryUrl('tnpm');
    tnpmRegistry = tnpmRegistry.trim().split('\n').pop() || '';

    try {
      const response = await axios.get(tnpmRegistry);

      if (response.status === 200) {
        return 'access tnpm registry is ok!';
      }
      return 'access tnpm registry has error, http code: ${response.statusCode}';
    } catch (error) {
      return 'access tnpm registry has error: ${error}';
    }
  }

  ctx.commander.register('doctor', 'environment information', () => {
    showToolVersion()
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log('error:', error);
      });
  });
};
