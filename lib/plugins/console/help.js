'use strict';
const meow = require('meow');

function helpConsole(args) {
  const cli = meow(`
            Usage: feflow [options] [command]
            
            Commands:
                configure --global        Config cli client.
                init                      Choose a scaffold to initialize project.
                scan     --receiver       Scan a group and mail to receiver.
                install  <plugin>         Install a plugin or a yeoman generator. 
                publish                   Publish files to cdn or offline package.
                    jb                    Publish to jb when in development.
                    ars --env             Publish to ars code platform, env is daily, pre or prod.
               
                
            Options:
                --version, -[vV]          Print version and exit successfully.
                --help, -[hH]             Print this help and exit successfully.
                
            Report bugs to http://git.code.oa.com/feflow/discussion/issues.    
        `);

  return cli.showHelp(1);
}

module.exports = helpConsole;