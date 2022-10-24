import fs from 'fs';
import path from 'path';

// 删除文件夹
export function removeDir(dir: string) {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach((file: string) => {
      const newPath = path.join(dir, file);
      const stat = fs.statSync(newPath);
      if (stat.isDirectory()) {
        // 如果是文件夹就递归下去
        removeDir(newPath);
      } else {
        // 删除文件
        fs.unlinkSync(newPath);
      }
    });
    fs.rmdirSync(dir);// 如果文件夹是空的，就将自己删除掉
  }
}
