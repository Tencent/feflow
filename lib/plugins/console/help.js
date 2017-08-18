'use strict';
const meow = require('meow');

module.exports = function (args) {
  const cli = meow(`
    Usage: feflow [options] [command]

    Commands:
        init                      Choose a boilerplate to initialize project.
        install  <plugin>         Install a plugin or a yeoman generator.


    Options:
        --version, -[v]           Print version and exit successfully.
        --help, -[h]              Print this help and exit successfully.

    Report bugs to https://github.com/iv-web/feflow-cli/issues.
  `);

  return cli.showHelp(1);
};
