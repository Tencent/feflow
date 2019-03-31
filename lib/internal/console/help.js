'use strict';
const meow = require('meow');

/**
 * beatify string
 * @param str
 * @param before length of space before str
 * @param total total length
 */
function beautify(str, before = 0, total) {
  const spaceLength = Math.max(0, total - before - str.length);
  return `${' '.repeat(before)}${str}${' '.repeat(spaceLength)}`;
}

module.exports = function (args) {
  const internalCmds = [
    'init',
    'install',
    'uninstall',
    'lint',
    'dev',
    'build',
    'config',
    'version',
    'help',
  ];
  const defaultMsgPrefix = `
    Usage: feflow [options] [command]

    Commands:
        init                      Choose a boilerplate to initialize project.
        install    <plugin>       Install a plugin or a yeoman generator.
        uninstall  <plugin>       Uninstall a plugin or a yeoman generator.
        lint       <folder>       Lint files or a folder.
        dev                       Local development.
        build                     Build and package.
        config                    Get, set or list .feflowrc.yml config items.
`,
    defaultMsgSuffix = `
    Options:
        --version, -[v]           Print version and exit successfully.
        --help, -[h]              Print this help and exit successfully.

    Report bugs to https://github.com/cpselvis/feflow-cli/issues.
  `;

  let appendedMsg = '';
  const cmds = this.cmd.list();
  if (cmds && Object.keys(cmds).length > 0) {
    Object.keys(cmds).forEach((key) => {
      if (internalCmds.indexOf(key) === -1) {
        appendedMsg += `${beautify(key, 8, 31)}   ${cmds[key].desc}\n`;
      }
    });
  }

  const cli = meow(`${defaultMsgPrefix}${appendedMsg}${defaultMsgSuffix}`);

  return cli.showHelp(0);
};
