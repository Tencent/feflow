import spawn from 'cross-spawn';
import childProcess from 'child_process';
import { promisify } from 'util';
import versionImpl from '../dep/version';
import {
  transformUrl,
  clearGitCert,
  clearGitCertByPath
} from '../../../shared/git';

const execFile = promisify(childProcess.execFile);

export async function getTag(
  repoUrl: string,
  version?: string
): Promise<string | undefined> {
  const url = await transformUrl(repoUrl);
  let ret: any;
  try {
    ret = await execFile('git', [
      'ls-remote',
      '--tags',
      '--refs',
      url
    ], {windowsHide: true});
  } catch (e) {
    throw 'unable to access ' + repoUrl;
  }

  await clearGitCert(url);
  const tagListStr = ret?.stdout?.trim();
  if (!tagListStr) {
    return;
  }

  const tagList = tagListStr.split('\n');
  let satisfiedMaxVersion: string | undefined;
  for (const tagStr of tagList) {
    const [, tagReference] = tagStr.split('\t');
    const tag = tagReference?.substring('refs/tags/'.length);
    if (!versionImpl.check(tag)) {
      continue;
    }
    if (tag === version) {
      return tag;
    }
    if (version && !versionImpl.satisfies(tag, version)) {
      continue;
    }
    if (!satisfiedMaxVersion || versionImpl.gt(tag, satisfiedMaxVersion)) {
      satisfiedMaxVersion = tag;
    }
  }
  return satisfiedMaxVersion;
}

export async function getCurrentTag(
  repoPath: string
): Promise<string | undefined> {
  const { stdout } = spawn.sync('git', ['status'], { windowsHide: true, cwd: repoPath });
  const matches = /v(0|[1-9]\d*).(0|[1-9]\d*).(0|[1-9]\d*)/.exec(stdout?.toString());
  if (matches && matches[0]) {
    return matches[0];
  }
}

export async function checkoutVersion(repoPath: string, version: string) {
  const command = 'git';
  spawn.sync(command, ['fetch', '--tags', '-f'], {
    stdio: 'ignore',
    windowsHide: true,
    cwd: repoPath
  });
  const checkArgs = ['checkout', '-f', version];
  spawn.sync(command, checkArgs, {
    stdio: 'ignore',
    windowsHide: true,
    cwd: repoPath
  });
  return clearGitCertByPath(repoPath);
}
