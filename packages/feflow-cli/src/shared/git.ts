import spawn from 'cross-spawn';

async function isSupportSSH(url: string): Promise<any> {
  const ret = spawn.sync('ssh', ['-vT', url]);
  const stderr = ret?.stderr?.toString();

  if (/Authentication succeeded/.test(stderr)) {
    return true;
  }

  return false;
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