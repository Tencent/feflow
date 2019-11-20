import shell from 'shelljs';
import os from 'os';
import path from 'path';
import fs from 'fs';
import objectFactory from "./objectFactory";

export const getUserNameFromGit = () => {
  let username = '';

  if (shell.which('git')) {
    username = shell
      .exec('git config --get user.name', { silent: true })
      .stdout.trim();
  } else {
    shell.echo('git is not avialble, you should make git is ok and set user.name in config');
  }
  return username;
};

export const getSystemInfoByOS = () => {
  return objectFactory
    .create()
    .load("hostname", os.hostname())
    .load("type", os.type())
    .load("platform", os.platform())
    .load("arch", os.arch())
    .load("release", os.release())
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
