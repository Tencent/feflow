import spawn from 'cross-spawn';
import childProcess from 'child_process';
import { promisify } from 'util';

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

export async function getLtsTag(repoUrl: string) {
  const execFile = promisify(childProcess.execFile);
  const { stdout } = await execFile('git', ['ls-remote', '--tags', repoUrl]);
  const tags = new Map();
  if (stdout.trim() === '') {
    throw 'no tag was found';
  }
  for (const line of stdout.trim().split('\n')) {
    const [hash, tagReference] = line.split('\t');
    const tagName = tagReference.replace(/^refs\/tags\//, '').replace(/\^\{\}$/, '');

    tags.set(tagName, hash);
  }
  return [...tags][tags.size - 1][0];
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