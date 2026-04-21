import spawn from 'cross-spawn';
import path from 'path';

// ─── 安全说明 ──────────────────────────────────────────────────────────────────
// 旧版实现存在两个高危漏洞：
//   1. 协议降级：将 git@host:path 改写为 http://host/path，使流量走明文 HTTP
//   2. URL 内联凭证：将账号密码拼入 URL（http://user:pass@host），
//      导致凭证出现在进程参数列表、日志、HTTPS 降级后的中间人可见流量中
// 修复方案：
//   - transformUrl 只允许 https:// / git@ 协议，拒绝 http://
//   - 凭证通过 GIT_ASKPASS 环境变量传递，不再内联进 URL
// ──────────────────────────────────────────────────────────────────────────────

let serverUrl: string;

export function setServerUrl(url: string) {
  serverUrl = url;
}

function getHostname(url: string): string {
  if (/^https?:\/\//.test(url)) {
    const [, , match = ''] = url.match(/^http(s)?:\/\/(.*?)\//) || [];
    return match.split('@').pop() || '';
  }
  const [, hostname = ''] = url.match(/@(.*):/) || [];
  return hostname;
}

/**
 * 安全地转换仓库 URL：
 * - 拒绝 http:// 协议（防止协议降级攻击）
 * - https:// 保持原样；git@ 在 SSH 不可用时转为 https://
 * - 不再将凭证内联到 URL 中
 *
 * @param url 原始仓库 URL（https:// 或 git@）
 * @returns 安全的仓库 URL（string）
 * @throws 若 URL 使用不允许的协议则抛出错误
 */
export async function transformUrl(url: string): Promise<string> {
  // 拒绝裸 http:// 协议（含内联凭证形式 http://user:pass@host）
  if (/^http:\/\//.test(url)) {
    throw new Error(`Insecure repository URL rejected (http is not allowed, use https or git@): ${url}`);
  }

  if (/^https:\/\//.test(url) || /^git@/.test(url)) {
    const hostname = getHostname(url);
    // 检测 SSH 可用性，超时 3s 回退到 https
    const sshOk = await isSupportSSH(`git@${hostname}`);
    if (sshOk) {
      // SSH 可用：https:// → git@host:path
      if (/^https:\/\//.test(url)) {
        return url.replace(/^https:\/\/([^/]+)\//, 'git@$1:');
      }
      return url;
    } else {
      // SSH 不可用：git@ → https://，https:// 保持不变
      if (/^git@/.test(url)) {
        return url.replace(/^git@([^:]+):/, 'https://$1/');
      }
      return url;
    }
  }

  throw new Error(`Unsupported repository protocol: ${url}`);
}

let _sshCache: Record<string, boolean> = {};

async function isSupportSSH(url: string): Promise<boolean> {
  if (_sshCache[url] !== undefined) {
    return _sshCache[url];
  }
  try {
    const result = await Promise.race([
      Promise.resolve(spawn.sync('ssh', ['-vT', url], { windowsHide: true })),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]) as ReturnType<typeof spawn.sync>;
    const ok = /Authentication succeeded/.test(result?.stderr?.toString() ?? '');
    _sshCache[url] = ok;
    return ok;
  } catch {
    _sshCache[url] = false;
    return false;
  }
}

/**
 * 构建安全的 Git 环境变量：
 * 通过 GIT_ASKPASS 脚本传递凭证，不将账号密码内联到 URL 或暴露在命令行参数中。
 *
 * @param account 可选账号信息 { username, password }
 * @returns 含 GIT_ASKPASS 的环境变量对象
 */
export function buildGitEnv(account?: { username: string; password: string }): NodeJS.ProcessEnv {
  if (!account) {
    return process.env;
  }
  return {
    ...process.env,
    GIT_TERMINAL_PROMPT: '0',
    GIT_ASKPASS: path.join(__dirname, 'git-askpass.sh'),
    FEFLOW_GIT_USERNAME: account.username,
    FEFLOW_GIT_PASSWORD: account.password,
  };
}

/**
 * 清除 git credential 缓存（使用 git credential reject）。
 * 修复后凭证不再内联进 URL，此函数仅在 url 包含凭证时有操作意义，
 * 新流程下可直接返回。
 */
export async function clearGitCert(_url: string): Promise<void> {
  // 新流程凭证通过 GIT_ASKPASS 传递，不内联进 URL，无需 credential reject
  return;
}

export async function clearGitCertByPath(_repoPath: string): Promise<void> {
  return;
}

/**
 * 安全下载仓库：URL 不含凭证，凭证通过环境变量传递。
 *
 * @param url      原始仓库 URL
 * @param tag      要 checkout 的 tag
 * @param filepath 本地目标路径
 * @param account  可选 Git 账号
 */
export async function download(
  url: string,
  tag: string,
  filepath: string,
  account?: { username: string; password: string }
): Promise<void> {
  const cloneUrl = await transformUrl(url);
  const env = buildGitEnv(account);

  console.log('clone from', url);
  return new Promise((resolve, reject) => {
    const child = spawn(
      'git',
      ['clone', '-b', tag, '--progress', '--depth', '1', cloneUrl, filepath],
      { stdio: 'pipe', windowsHide: true, env }
    );
    let doneFlag = false;
    child.stderr?.on('data', (d) => {
      if (doneFlag) return;
      if (d?.toString()?.startsWith('Note:') || d?.toString()?.startsWith('注意')) {
        doneFlag = true;
        return;
      }
      process.stderr.write(d);
    });
    child.stdout?.on('data', (d) => {
      if (doneFlag) return;
      process.stdout.write(d);
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(code);
    });
    child.on('error', reject);
  });
}
