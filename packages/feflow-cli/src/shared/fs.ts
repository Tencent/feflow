import fs from 'fs';
import path from 'path';
import util from 'util';

export const statAsync = util.promisify(fs.stat);
export const copyFileAsync = util.promisify(fs.copyFile);
export const mkdirAsync = util.promisify(fs.mkdir);
export const readdirAsync = util.promisify(fs.readdir);
export const readFileAsync = util.promisify(fs.readFile);
export const unlinkAsync = util.promisify(fs.unlink);
export const writeFileAsync = util.promisify(fs.writeFile);

export async function copyDir(srcPath: string, tarPath: string) {
  const [srcStats, tarStats] = await Promise.all([
    statAsync(srcPath).catch(() => null),
    statAsync(tarPath).catch(() => null),
  ]);
  if (!srcStats) {
    throw `the source path [${srcPath}] does not exist`;
  }
  if (!srcStats.isDirectory()) {
    throw `the source path [${srcPath}] is not a folder`;
  }
  if (!tarStats) {
    await mkdirAsync(tarPath, { recursive: true });
  }
  const files = await readdirAsync(srcPath);
  return copyFiles(srcPath, tarPath, files);
}

async function copyFiles(srcPath: string, tarPath: string, files: string[]) {
  return Promise.all(
    files.map(async (filename) => {
      const fileDir = path.join(srcPath, filename);
      const stats = await statAsync(fileDir);
      const isFile = stats.isFile();
      if (isFile) {
        const destPath = path.join(tarPath, filename);
        await copyFileAsync(fileDir, destPath);
      } else {
        const tarFileDir = path.join(tarPath, filename);
        await mkdirAsync(tarFileDir);
        await copyDir(fileDir, tarFileDir);
      }
    }),
  );
}
