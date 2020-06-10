/**
 * 获取系统类型
 * @return {String} 'MacOS|Windows|Linux'
 */
export default function getOSType() {
    let opsys = process.platform;
    if (opsys === 'darwin') {
        opsys = 'MacOS';
    } else if (opsys === 'win32') {
        opsys = 'Windows';
    } else if (opsys === 'linux') {
        opsys = 'Linux';
    }
    return opsys;
}
