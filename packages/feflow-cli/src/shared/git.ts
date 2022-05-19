import spawn from 'cross-spawn';
import rp from 'request-promise';
import { getURL } from './url';

let gitAccount: {
  username: string;
  password: string;
};
let serverUrl: string;

export function setServerUrl(url: string) {
  serverUrl = url;
}

function getHostname(url: string): string {
  if (/https?/.test(url)) {
    const [, , match = ''] = url.match(/^http(s)?:\/\/(.*?)\//) || [];
    return match.split('@').pop() || '';
  }
  const [, hostname = ''] = url.match(/@(.*):/) || [];
  return hostname;
}

async function prepareAccount() {
  if (gitAccount) {
    return;
  }
  const url = getURL(serverUrl, 'apply/getlist?name=0');
  if (!url) {
    return;
  }
  const options = {
    url,
    method: 'GET',
  };
  return rp(options)
    .then((response: string) => {
      const data = JSON.parse(response);
      if (data.account) {
        gitAccount = data.account;
      }
    })
    .catch(() => {});
}

export async function transformUrl(url: string, account?: any): Promise<any> {
  if (account) {
    gitAccount = account;
  } else {
    await prepareAccount();
  }
  const hostname = getHostname(url);
  let transformedUrl;
  if (/https?/.test(url)) {
    transformedUrl = url;
  } else {
    transformedUrl = url.replace(`git@${hostname}:`, `http://${hostname}/`);
  }
  if (gitAccount) {
    const { username, password } = gitAccount;
    return transformedUrl.replace(/https?:\/\/(.*?(:.*?)?@)?/, `http://${username}:${password}@`);
  }
  return transformedUrl;
}

export async function clearGitCert(url: string) {
  const { username } = gitAccount;
  if (!username) {
    return;
  }
  let finalUrl = '';
  if (!/https?:\/\/(.*?(:.*?)?@)/.test(url)) {
    finalUrl = await transformUrl(url);
  }
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['credential', 'reject'], {
      windowsHide: true,
      timeout: 60 * 1000,
    });
    child.stdin?.write(`url=${finalUrl}`);
    child.stdin?.end();
    child.on('close', (code) => {
      resolve(code);
    });
    child.on('error', (err) => {
      reject(err);
    });
  });
}

export async function clearGitCertByPath(repoPath: string) {
  const ret = spawn.sync('git', ['config', '--get', 'remote.origin.url'], {
    windowsHide: true,
    cwd: repoPath,
  });
  const url = ret?.stdout?.toString().trim();
  return clearGitCert(url);
}

export async function download(url: string, tag: string, filepath: string): Promise<any> {
  const cloneUrl = await transformUrl(url);

  console.log('clone from', url);
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['clone', '-b', tag, '--progress', '--depth', '1', cloneUrl, filepath], {
      stdio: 'pipe',
      windowsHide: true,
    });
    let doneFlag = false;
    child.stderr?.on('data', (d) => {
      if (doneFlag) {
        return;
      }
      if (d?.toString()?.startsWith('Note:') || d?.toString()?.startsWith('注意')) {
        doneFlag = true;
        return;
      }
      process.stderr.write(d);
    });
    child.stdout?.on('data', (d) => {
      if (doneFlag) {
        return;
      }
      process.stdout.write(d);
    });
    child.on('close', (code) => {
      if (code === 0) {
        resolve(0);
      } else {
        reject(code);
      }
    });
    child.on('error', (err) => {
      reject(err);
    });
  })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .finally(() => clearGitCert(cloneUrl));
}
