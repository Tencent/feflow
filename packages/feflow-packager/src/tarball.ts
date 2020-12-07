import path from 'path';
import execa from 'execa';

export async function packCLI() {
  const { stdout } = await execa('npm', ['pack', '--unsafe-perm'], {
    cwd: process.cwd(),
    stdio: [0, 'pipe', 2],
    windowsHide: true,
  });

  return path.join(process.cwd(), stdout);
}