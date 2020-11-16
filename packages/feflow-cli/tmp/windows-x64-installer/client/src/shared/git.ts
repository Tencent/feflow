import spawn from 'cross-spawn';

let isSSH: any;
async function isSupportSSH(url: string): Promise<any> {
  if (isSSH) {
    return isSSH;
  }
  try {
    const res: any = await Promise.race([
      spawn.sync('ssh', ['-vT', url]),
      new Promise((resolve: any, reject: any) => {
        setTimeout(() => {
          reject(new Error('SSH check timeout'));
        }, 1000);
      }),
    ]);

    const stderr = res?.stderr?.toString();
    if (/Authentication succeeded/.test(stderr)) {
      isSSH = true;
    } else {
      isSSH = false;
    }
    return isSSH;
  } catch (err) {
    console.log('Git ssh check timeout, use https');
    isSSH = false;
    return isSSH;
  }
}

function getHostname(url: string): string {
  if (/https?/.test(url)) {
    const match: any = url.match(/^http(s)?:\/\/(.*?)\//);
    return match[2];
  }
  const match: any = url.match(/@(.*):/);
  return match[1];
}

let gitAccount: any;
export async function transformUrl(url: string, account?: any): Promise<any> {
  const hostname = getHostname(url);
  const isSSH = await isSupportSSH(`git@${hostname}`);
  if (isSSH) {
    if (/https?/.test(url)) {
      return url.replace(/https?:\/\//, 'git@').replace(/\//, ':');
    }
    return url;
  }
  let transformedUrl;
  if (/https?/.test(url)) {
    transformedUrl = url;
  } else {
    transformedUrl = url.replace(`git@${hostname}:`, `http://${hostname}/`);
  }
  if (account) {
    gitAccount = account;
  }
  if (gitAccount) {
    const { username, password } = gitAccount;
    return transformedUrl.replace(/http:\/\//, `http://${username}:${password}@`);
  }
  return transformedUrl;
}
