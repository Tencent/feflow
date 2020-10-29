import spawn from 'cross-spawn';
import childProcess from 'child_process';
import { promisify } from 'util';
import versionImpl from '../dep/version';
import {
  transformUrl
} from '../../../shared/git';

const execFile = promisify(childProcess.execFile);

export async function getTag(
  repoUrl: string,
  version?: string
): Promise<string | undefined> {
  const url = await transformUrl(repoUrl);
  const { stdout } = await execFile('git', [
    'ls-remote',
    '--tags',
    '--refs',
    url
  ]);

  const tagListStr = stdout?.trim();
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
  const tagsRsp = spawn.sync('git', ['-C', repoPath, 'tag', '-l']);
  let tags = tagsRsp?.stdout?.toString().trim().split('\n');
  tags = tags.filter(v => versionImpl.check(v)).sort((a, b) => versionImpl.gt(a, b) ? -1 : 1);
  return tags?.[0];
}

export function checkoutVersion(repoPath: string, version: string) {
  const command = 'git';
  spawn.sync(command, ['-C', repoPath, 'fetch', '--tags', '-f'], { stdio: 'ignore' });
  const checkArgs = ['-C', repoPath, 'checkout', '-f', version];
  return spawn.sync(command, checkArgs, { stdio: 'ignore' });
}
