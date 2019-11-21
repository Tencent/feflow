import meow from 'meow';

module.exports = (ctx: any) => {
    ctx.commander.register('help', 'Help messages', () => {
      const cli = meow(`
        Usage: feflow [options] [command]
        Commands:
            init                      Choose a boilerplate to initialize project.
            install    <plugin>       Install a plugin or a yeoman generator.
            uninstall  <plugin>       Uninstall a plugin or a yeoman generator.
            lint       <folder>       Lint files or a folder.
            dev                       Local development.
            build                     Build and package.
        Options:
            --version, -[v]           Print version and exit successfully.
            --help, -[h]              Print this help and exit successfully.
            --list, -[l]              Print all all plugins installed.
        Report bugs to https://github.com/Tencent/feflow.
      `);

      return cli.showHelp(0);
    });
};