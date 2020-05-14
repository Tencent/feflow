import os from 'os';
import path from 'path';
import fs from 'fs';
import objectFactory from './objectFactory';

export const getUserNameFromGit = () => {
  const hostname = os.hostname();
  const [upperUserName, ...device] = hostname.split('-');
  return upperUserName.toLowerCase();
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
