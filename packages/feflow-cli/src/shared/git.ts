import spawn from 'cross-spawn';

async function isSupportSSH(url: string): Promise<any> {
  const res: any = Promise.race([
    spawn.sync('ssh', ['-vT', url]),
    new Promise((resolve: any, reject: any) => {
      setTimeout(() => {
        reject(new Error('SSH check timeout'));
      }, 1000);
    })
  ]);

  res.then((ret: any) => {
    const stderr = ret?.stderr?.toString();
    if (/Authentication succeeded/.test(stderr)) {
      return true;
    }
    return false;
  }).catch((err: any) => {
    console.log('Git ssh check timeout, use https');
    return false;
  });
}

function getHostname(url: string): string {
  if (/https?/.test(url)) {
    const match: any = url.match(/^http(s)?:\/\/(.*?)\//);
    return match[2];
  } else {
    const match: any = url.match(/@(.*):/);
    return match[1];
  }
}

export async function transformUrl(url: string): Promise<any> {
  const hostname = getHostname(url);
  const isSSH = await isSupportSSH(`git@${hostname}`);
  if (isSSH) {
    if (/https?/.test(url)) {
      return url.replace(/https?:\/\//, 'git@').replace(/\//, ':');
    } else {
      return url;
    }
  } else {
    if (/https?/.test(url)) {
      return url;
    } else {
      return url.replace(`git@${ hostname }:`, `http://${ hostname }/`);
    }
  }
}