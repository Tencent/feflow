import commandLineUsage from 'command-line-usage';

const getCommands = (store: any) => {
  const arr = [];
  for (const name in store) {
    const desc = store[name].desc;
    arr.push({
      colA: name,
      colB: desc
    });
  }
  return arr;
};

const showHelp = (commands: Array<Object>) => {
  const sections = [
    {
      header: 'Usage',
      content: '$ fef [options] [command]'
    },
    {
      header: 'Commands',
      content: {
        data: commands,
        options: {
          maxWidth: 60
        }
      }
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'version',
          description: 'Print version and exit successfully.'
        },
        {
          name: 'help',
          description: 'Print this help and exit successfully.'
        },
        {
          name: 'disable-check',
          description: 'Disable @feflow/cli and installed plugins check update'
        },
        {
          name: 'auto-update',
          description: 'Auto update @feflow/cli and installed plugins'
        }
      ]
    }
  ];
  const usage = commandLineUsage(sections);

  return usage;
};

module.exports = (ctx: any) => {
  ctx.commander.register('help', 'Help messages', () => {
    const commands = getCommands(ctx.commander.store);
    const usage = showHelp(commands);
    console.log(usage);
  });
};
