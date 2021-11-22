import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import spawn from 'cross-spawn';
import cliMd from 'cli-html-c';
import commandLineUsage from 'command-line-usage';
import marked from 'marked';

import Feflow from '@/core';
import { UNIVERSAL_README_CONFIG } from '@/shared/constant';
import { Store } from '../commander';

const getCommands = (store: Store) => {
  const arr: {
    colA: string;
    colB: string;
  }[] = [];
  Object.entries(store).forEach(([colA, { desc }]) => {
    arr.push({
      colA,
      colB: (desc instanceof Function ? desc() : desc).replace(/({|})/g, (val: string) => escape(val)),
    });
  });
  return arr;
};

const showHelp = (commands: ReturnType<typeof getCommands>) => {
  const sections = [
    {
      header: 'Usage',
      content: '$ fef [options] [command]',
    },
    {
      header: 'Commands',
      content: {
        data: commands,
        options: {
          maxWidth: 60,
        },
      },
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'version',
          description: 'Print version and exit successfully.',
        },
        {
          name: 'help',
          description: 'Print this help and exit successfully.',
        },
        {
          name: 'disable-check',
          description: 'Disable @feflow/cli and installed plugins check update',
        },
        {
          name: 'auto-update',
          description: 'Auto update @feflow/cli and installed plugins',
        },
      ],
    },
  ];

  return commandLineUsage(sections);
};

const parseReadme = (path: string) => {
  let readmeText = '';
  if (fs.existsSync(path)) {
    readmeText = fs.readFileSync(path, 'utf8');
  }
  return cliMd(marked(readmeText));
};

export default (ctx: Feflow) => {
  ctx.commander.register('help', 'Help messages', () => {
    const { store } = ctx.commander;
    let cmd = ctx.args._[0];
    cmd = cmd && String.prototype.toLowerCase.call(cmd);
    // fef help xxx 的 case
    if (cmd) {
      if (Object.prototype.hasOwnProperty.call(store, cmd)) {
        const commandInfo = store[cmd];

        // 优先展示组件注册信息
        if (commandInfo.options?.length) {
          const universalUsage = commandInfo.options[0];
          const { type, content } = universalUsage instanceof Function ? universalUsage() : universalUsage;

          // case 1: 多语言情况下 yml 有 usage 属性时，执行对应的内容
          if (type === 'usage') {
            spawn(content, {
              stdio: 'inherit',
              shell: true,
              windowsHide: true,
            });
            return;
          }

          // case 2: 多语言情况下 yml 没有 usage 属性时，优先读取 readme 展示出来
          if (type === 'path') {
            const pluginConfigPath = path.join(content, UNIVERSAL_README_CONFIG);
            const readmeText = parseReadme(pluginConfigPath);

            if (readmeText) {
              console.log(readmeText);
              return;
            }

            // case 3: 多语言情况下既没有 usage，又没有 README.md，则展示插件的 desc
            console.log(commandInfo.desc);
            return;
          }

          // case 4: nodejs 且有写 options 的情况
          const usage = commandLineUsage(commandInfo.options);
          console.log(usage);
          return;
        }

        // case 5: nodejs 且没有写 options 的情况，直接展示插件的 desc
        console.log(commandInfo.desc);
        return;
      }

      console.log(chalk.yellow(`Command '${cmd}' not found in feflow. You need to install it first.`));
      console.log('Below is the usage of feflow.');
    }

    // 打印 fef 的 usage
    const commands = getCommands(ctx.commander.store);
    const usage = showHelp(commands);
    console.log(usage);
  });
};
