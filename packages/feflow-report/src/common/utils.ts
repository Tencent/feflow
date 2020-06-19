import os from 'os';
import path from 'path';
import fs from 'fs';
import objectFactory from './objectFactory';
import { execSync } from 'child_process';

const platform = os.platform();
const isWin = platform === 'win32';
const isMac = platform === 'darwin';

const exec = (command: string) => {
  let result = '';
  try {
    result = execSync(command).toString();
  } catch (err) {
    console.log('feflow report get username err: ', err);
  }
  return result;
};

const getUserNameFromHostName = () => {
  const hostname = os.hostname();
  const [upperUserName, ...device] = hostname.split('-');
  return upperUserName.toLowerCase();
};

const getUserNameFromLinux = () => {
  const nameFromLinux = exec('whoami');
  if (nameFromLinux === 'root') {
    return '';
  }

  return nameFromLinux.replace(/\n/, '');
};

const getUserNameFromGit = () => {
  const isGitAvailable = exec('which git');
  if (!isGitAvailable) {
    return '';
  }
  const nameFromLinux = exec('git config user.name');

  return nameFromLinux;
};

export const getUserName = () => {
  // mac/window
  if (isMac || isWin) {
    return getUserNameFromHostName();
  }
  return getUserNameFromLinux() || getUserNameFromGit() || getUserNameFromHostName();
};

export const getSystemInfoByOS = () => {
  return objectFactory
    .create()
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
