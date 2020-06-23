import os from 'os';
import path from 'path';
import fs from 'fs';
import objectFactory from './objectFactory';
import { execSync } from 'child_process';

const platform = os.platform();
const isWin = platform === 'win32';
const isMac = platform === 'darwin';
const cwd = process.cwd();

export const httpRegex = /^https?\:\/\/(?:[^\/]+)\/([^\/]+)\/([^\/.]+)(?:\.git)?/;
export const sshRegex = /^git@(?:[^\:]+)\:([^\/]+)\/([^\/\.]+)(?:\.git)?/;

const isGitAvailable = (): boolean => {
  const hasGitCommand = exec('which git');
  const hasGitDir = fs.existsSync(path.join(cwd, '.git'));
  return hasGitCommand && hasGitDir;
};

const exec = (command: string) => {
  let result = '';
  try {
    result = execSync(command)
      .toString()
      .replace(/\n/, '');
  } catch (err) {}
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

  return nameFromLinux;
};

const getUserNameFromGit = () => {
  if (!isGitAvailable()) {
    return '';
  }
  const nameFromLinux = exec('git config user.name');

  return nameFromLinux;
};

export const getUserName = () => {
  // mac/window
  if (isMac || isWin) {
    return getUserNameFromHostName() || getUserNameFromGit();
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

export const getProjectByGit = (url?: string) => {
  if (!isGitAvailable()) {
    return '';
  }

  let project = '';
  const gitRemoteUrl = url || exec('git remote get-url origin');
  let urlRegex: RegExp;

  if (httpRegex.test(gitRemoteUrl)) {
    urlRegex = httpRegex;
  } else if (sshRegex.test(gitRemoteUrl)) {
    urlRegex = sshRegex;
  }
  if (!urlRegex) return '';

  const [_, group, path] = urlRegex.exec(gitRemoteUrl) || [];
  project = group ? `${group}/${path}` : '';

  return project;
};
