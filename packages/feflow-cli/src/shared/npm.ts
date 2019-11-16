import spawn from 'cross-spawn';

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
        }).pipe(process.stdout);

        child.stderr!.on('data', (data) => {
            output += data;
        }).pipe(process.stderr);

        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            output = output.replace(/\n/, '');
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