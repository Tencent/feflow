import spawn from 'cross-spawn';
import childProcess from 'child_process';
import { promisify } from 'util';
import versionImpl from '../dep/version';
import { transformUrl, clearGitCert, clearGitCertByPath } from '../../../shared/git';

const execFile = promisify(childProcess.execFile);

export async function getTag(repoUrl: string, version?: string): Promise<string | undefined> {
  const url = await transformUrl(repoUrl);
  let ret;
  try {
    ret = await execFile('git', ['ls-remote', '--tags', '--refs', url], {
      windowsHide: true,
    });
  } catch (e) {
    throw new Error(`unable to access ${repoUrl}`);
  }

  await clearGitCert(url);
  const tagListStr = ret?.stdout?.trim();
  if (!tagListStr) {
    return;
  }

  const tagList = tagListStr.split('\n');
  let satisfiedMaxVersion: string | undefined;
  tagList.forEach((tagStr: string) => {
    const [, tagReference] = tagStr.split('\t');
    const tag = tagReference?.substring('refs/tags/'.length);
    if (tag === version) {
      return tag;
    }
    if (tag.includes(version || '') && (!satisfiedMaxVersion || versionImpl.gt(tag, satisfiedMaxVersion))) {
      satisfiedMaxVersion = tag;
    }
  });

  return satisfiedMaxVersion;
}

export async function getCurrentTag(repoPath: string): Promise<string | undefined> {
  const { stdout } = spawn.sync('git', ['log', '--decorate', '-1'], {
    windowsHide: true,
    cwd: repoPath,
  });
  const matches = /tag: (v(0|[1-9]\d*).(0|[1-9]\d*).(0|[1-9]\d*))/.exec(stdout?.toString());
  if (matches?.[1]) {
    return matches[1];
  }
}

export async function checkoutVersion(repoPath: string, version: string, lastVersion?: string) {
  const command = 'git';
  spawn.sync(command, ['fetch', '-n', '-f', '--depth', '1', 'origin', 'tag', version], {
    stdio: 'ignore',
    windowsHide: true,
    cwd: repoPath,
  });
  const checkArgs = ['checkout', '-f', version];
  spawn.sync(command, checkArgs, {
    stdio: 'ignore',
    windowsHide: true,
    cwd: repoPath,
  });
  if (lastVersion) {
    try {
      spawn.sync(command, ['tag', '-d', lastVersion], {
        stdio: 'ignore',
        windowsHide: true,
        cwd: repoPath,
      });
      gitGC(repoPath);
    } catch (e) {}
  }
  return clearGitCertByPath(repoPath);
}

function gitGC(repoPath: string) {
  spawn.sync('git', ['gc', '--prune=all'], {
    stdio: 'ignore',
    windowsHide: true,
    cwd: repoPath,
  });
}
