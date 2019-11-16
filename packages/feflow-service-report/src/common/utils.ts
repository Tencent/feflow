import shell from 'shelljs';
import os from 'os';
import path from 'path';
import fs from 'fs';
import Hanzo from './hanzo';

export const getUserNameFromGit = () => {
  let username = '';

  if (shell.which('git')) {
    // shell.exit(1);

    username = shell
      .exec('git config --get user.name', { silent: true })
      .stdout.trim();
  } else {
    shell.echo('Sorry, this script requires git');
  }
  return username;
};

export const getSystemInfoByOS = () => {
  return Hanzo.create()
    .load('hostname', os.hostname())
    .load('type', os.type())
    .load('platform', os.platform())
    .load('arch', os.arch())
    .load('release', os.release())
    .done();
};

export const getProjectByPackage = () => {
  let project = '';
  const pkgPath = path.resolve(process.cwd(), './package.json');
  if (fs.existsSync(pkgPath)) {
    project = require(pkgPath).name;
  }
  return project;
};
