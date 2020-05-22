import spawn from 'cross-spawn';
import childProcess from 'child_process';
import { promisify } from 'util';
import semver from 'semver';

export function getRegistryUrl(packageManager: string) {
    return new Promise<any>((resolve, reject) => {
        const command = packageManager;
        const args = [
            'config',
            'get',
            'registry'
        ];

        const child = spawn(command, args);

        let output = '';

        child.stdout!.on('data', (data) => {
            output += data;
        });

        child.stderr!.on('data', (data) => {
            output += data;
        });

        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            output = output.replace(/\n/, '').replace(/\/$/, '');
            resolve(output);
        });
    });
}

export function install(packageManager: string, root: any, cmd: any, dependencies: any, verbose: boolean, isOnline: boolean) {
  return new Promise((resolve, reject) => {
    const command = packageManager;
    const args = [
        cmd,
        '--save',
        '--save-exact',
        '--loglevel',
        'error',
    ].concat(dependencies);

    if (verbose) {
      args.push('--verbose');
    }

    const child = spawn(command, args, { stdio: 'inherit', cwd: root });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

async function listRepoTag(repoUrl: string): Promise<string[]> {
  const execFile = promisify(childProcess.execFile);
  const { stdout } = await execFile('git', ['ls-remote', '--tags', '--refs', repoUrl]);
  const tagStr = stdout?.trim();
  let tagList: string[] = [];

  if (tagStr) {
    const tagVersionList = tagStr.split('\n');
    if (tagVersionList.length) {
      for (let i = tagVersionList.length - 1; i >= 0; i--) {
        const [, tagReference] = tagVersionList[i].split('\t');
        // v0.1.2
        if (/^refs\/tags\/v\d+.\d+.\d+$/i.test(tagReference)) {
          const tag = tagReference.substring('refs/tags/'.length);
          tagList.push(tag);
        }
      }
    }
  }
  return tagList;
}


export async function getTag(repoUrl: string, version?: string) {
  const tagList = await listRepoTag(repoUrl);

  if (tagList.length) {
    for (const tag of tagList) {
        if (!version || version === tag) {
          return Promise.resolve(tag);
        }
    }
  }
  return Promise.reject('no valid tag was found');
}

export async function getLatestTag(repoUrl: string) {
  const tagList = await listRepoTag(repoUrl);
  let lastVersion = '';
  if (tagList.length) {
    for (const tag of tagList) {
      if (!lastVersion) {
        lastVersion = tag;
      } else if (semver.gt(tag, lastVersion)) {
        lastVersion = tag;
      }
    }
  }
  return lastVersion || "latest"
}

export function checkoutVersion(repoPath: string, version: string) {
  return new Promise((resolve, reject) => {
    const command = 'git';
    spawn.sync(command, ['-C', repoPath, 'pull'], { stdio: 'ignore'});
    const checkArgs = [
        '-C',
        repoPath,
        'checkout',
        version
    ];
    const child = spawn(command, checkArgs, { stdio: 'ignore'});
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${checkArgs.join(' ')}`,
          code
        });
        return;
      }
      resolve();
    });
  });
}