// 查询进程的代码参考https://github.com/neekey/ps
import { spawn } from 'child_process';
import os from 'os';
import psNode from 'ps-node';

/**
 * End of line.
 * Basically, the EOL should be:
 * - windows: \r\n
 * - *nix: \n
 * try to get every possibilities covered.
 */
const EOL = /(\r\n)|(\n\r)|\n|\r/;
const SystemEOL = os.EOL;
const IS_WIN = process.platform === 'win32';

function lookUpAllProcess(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (IS_WIN) {
      const CMD = spawn('cmd');
      let stdout = '';
      let stderr = '';

      CMD.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      CMD.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      CMD.on('exit', () => {
        let beginRow: any;
        const stdoutArr = stdout.split(EOL);

        // Find the line index for the titles
        stdoutArr.forEach((out: string | string[], index: any) => {
          if (out && typeof beginRow === 'undefined' && out.indexOf('CommandLine') === 0) {
            beginRow = index;
          }
        });

        // get rid of the start (copyright) and the end (current pwd)
        stdoutArr.splice(stdout.length - 1, 1);
        stdoutArr.splice(0, beginRow);

        if (stderr) {
          return reject(stderr);
        }
        return resolve(stdoutArr.join(SystemEOL));
      });

      CMD.stdin.write('wmic process get ProcessId,ParentProcessId,CommandLine \n');
      CMD.stdin.end();
    } else {
      const child = spawn('ps', ['aux']);
      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('exit', () => {
        if (stderr) {
          return reject(stderr);
        }
        return resolve(stdout);
      });
    }
  });
};

// 判断某个进程是否存在
export async function isProcessExist(psName: string) {
  let psInfo: string;
  try {
    psInfo = await lookUpAllProcess();
    const pattern = new RegExp(`${psName}`);
    return pattern.test(psInfo);
  } catch (e) {
    console.error(e);
  }
};

// 根据进程id判断某个进程是否存在
export async function isProcessExistByPid(pid: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    psNode.lookup({ pid }, (err, psList) => {
      if (err) return reject(err);

      if (Array.isArray(psList) && psList[0]) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
