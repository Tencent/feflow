/**
 * 编辑器通用公共能力
*/
import { Message } from 'element-ui';
const { clipboard, ipcRenderer, shell } = require('electron');
/**
 * 复制文本
 * @param {String} text 待复制文本
 */
export function copyText(text) {
  clipboard.writeText(text);

  Message({
    type: 'success',
    message: '复制成功!',
  });
}

/**
 * 内嵌浏览器打开
 * @param {String} link 超链接地址
 */
export function openWebview(link) {
  ipcRenderer.send('create-project-webview', { routeName: 'project-webview', link });
}

/**
 * 文件管理器打开
 * @param {String} uri 本地文件夹地址
 */
export function openFinder(uri) {
  shell.showItemInFolder(uri);
}

/**
 * 用外部桌面浏览器打开
 * @param {String} href
 */
export function openBrowser(href) {
  shell.openExternal(href);
}
