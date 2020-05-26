import spawn from 'cross-spawn';
import childProcess from 'child_process';
import { promisify } from 'util';
import versionImpl from '../dep/version';

export async function getTag(repoUrl: string, version?: string): Promise<string | undefined> {
  const execFile = promisify(childProcess.execFile);
  const { stdout } = await execFile('git', ['ls-remote', '--tags', '--refs', repoUrl]);

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

export async function getCurrentTag(repoPath: string): Promise<string | undefined> {
  const status = spawn.sync('git', ['-C', repoPath, 'status']);
  const tagFlag = 'HEAD detached at ';
  const head = status?.stdout?.toString().trim().split('\n')[0];
  if (head.startsWith(tagFlag)) {
    return head.substring(tagFlag.length);
  }
}

export function checkoutVersion(repoPath: string, version: string) {
  const command = 'git';
  spawn.sync(command, ['-C', repoPath, 'pull'], { stdio: 'ignore'});
  const checkArgs = [
      '-C',
      repoPath,
      'checkout',
      version
  ];
  return spawn.sync(command, checkArgs, { stdio: 'ignore'});
}