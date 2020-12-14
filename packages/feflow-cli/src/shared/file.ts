import fs from 'fs';
/*
* @description 保证文件一定存在，文件不存在则创建文件
* @param filePath 文件路径
* */
export function fileExit(filePath: string) {
    try {
        fs.readFileSync(filePath, 'utf-8');
    } catch (_) {
        fs.appendFileSync(filePath, '', 'utf-8');
    }
}
