import os from 'os';

const OS_WIN = "win32";

// 对命令字符串进行shell转义
export function escape(arg: string): string {
    // windows保持原样
    if (os.platform() === OS_WIN) {
        return arg;
    }
    if (/[^A-Za-z0-9_\/:=-]/.test(arg)) {
        arg = "'" + arg.replace(/'/g, "'\\''") + "'";
        arg = arg.replace(/^(?:'')+/g, '')  // 消除重复的单引号
                .replace(/\\'''/g, "\\'"); // 如果有两个转义单引号，则删除非转义单引号
    }
    return arg;
}