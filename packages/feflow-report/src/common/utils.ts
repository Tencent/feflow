/* eslint-disable @typescript-eslint/no-require-imports */
import os from 'os';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

import Feflow from '@feflow/cli';
import objectFactory from './objectFactory';

const platform = os.platform();
const isWin = platform === 'win32';
const isMac = platform === 'darwin';
const cwd = process.cwd();

export const httpRegex = /^https?:\/\/[^/]+\/([^/]+)\/([^/.]+)(?:\.git)?/;
export const sshRegex = /^git@[^:]+:([^/]+)\/([^/.]+)(?:\.git)?/;

const exec = (command: string) => {
  let result = '';
  try {
    result = execSync(command, {
      windowsHide: true,
      stdio: 'pipe',
    })
      .toString()
      .replace(/\n/, '');
  } catch (err) {}
  return result;
};

export const getGitStatus = (): boolean => {
  const command = isWin ? 'where git' : 'which git';
  const hasGitCommand = exec(command);
  const hasGitDir = fs.existsSync(path.join(cwd, '.git'));
  return Boolean(hasGitCommand && hasGitDir);
};

const isGitAvailable = getGitStatus();

const getUserNameFromHostName = () => {
  const hostname = os.hostname();
  const [upperUserName] = hostname.split('-');
  if (upperUserName === 'MacBook') return '';
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
  if (!isGitAvailable) {
    return '';
  }
  return exec('git config user.name');
};

export const getUserName = () => {
  // mac/window
  if (isMac || isWin) {
    return getUserNameFromHostName() || getUserNameFromGit() || os.hostname();
  }
  return getUserNameFromLinux() || getUserNameFromGit() || getUserNameFromHostName();
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
  let project = '';
  const gitRemoteUrl = url || exec('git remote get-url origin');
  let urlRegex: RegExp | null = null;

  if (httpRegex.test(gitRemoteUrl)) {
    urlRegex = httpRegex;
  } else if (sshRegex.test(gitRemoteUrl)) {
    urlRegex = sshRegex;
  }
  if (!urlRegex) return '';

  const [, group, path] = urlRegex.exec(gitRemoteUrl) || [];
  project = group ? `${group}/${path}` : '';

  return project;
};

export const getSystemInfo = () => {
  const systemDetailInfo = objectFactory
    .create()
    .load('hostname', os.hostname())
    .load('type', os.type())
    .load('platform', os.platform())
    .load('arch', os.arch())
    .load('release', os.release())
    .done();
  return JSON.stringify(systemDetailInfo);
};

export const getProject = (ctx: Feflow, local?: boolean): string => {
  const { pkgConfig } = ctx;
  let project = '';
  if (pkgConfig?.name && !local) {
    // feflow context
    project = pkgConfig.name;
  } else {
    try {
      // if not, read project name from project's package.json or git
      project = getProjectByPackage();
      if (!project && isGitAvailable) {
        project = getProjectByGit();
      }
    } catch (error) {
      console.error('getProject error =>', error);
    }
  }

  return project;
};

export const getKeyFormFile = (file: string, key: string) => {
  try {
    const jsonString = fs.readFileSync(file, 'utf-8');
    const jsonData = JSON.parse(jsonString);
    return jsonData[key];
  } catch (e) {
    console.error('getKeyFormCache error =>', e);
  }
};

export const setKeyToFile = (file: string, key: string, value: any) => {
  try {
    const jsonString = fs.readFileSync(file, 'utf-8');
    const jsonData = JSON.parse(jsonString);
    jsonData[key] = value;
    fs.writeFileSync(file, JSON.stringify(jsonData, null, 4), 'utf-8');
  } catch (e) {
    console.error('setKeyToCache error =>', e);
  }
};
