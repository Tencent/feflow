/**
 * 主线程与渲染线程的通信
 * @description 注册通信事件
 */
import { ipcMain, BrowserWindow } from 'electron'
import { getUrl } from '../common/utils'

// GUI 统一参数
const WIN_CONF = {
  width: 840,
  height: 600
}
/**
 * 打开项目服务窗口
 */
function createProjectService() {
  ipcMain.on('create-project-service', (event, { routeName, projectName, projectPath }) => {
    if (!routeName || !projectPath || !projectName) {
      return
    }

    let win = new BrowserWindow({
      width: WIN_CONF.width,
      height: WIN_CONF.height,
      useContentSize: true,
      titleBarStyle: 'hidden',
      webPreferences: {
        webSecurity: false
      }
    })

    win.on('close', () => {
      win = null
    })
    const url = `${getUrl(routeName)}?path=${projectPath}&name=${projectName}`
    win.loadURL(url)
  })
}

/**
 * 打开项目webview窗口
 */
function createProjectWebview () {
  debugger
  ipcMain.on('create-project-webview', (event, { routeName, link }) => {
    if (!routeName || !link) {
      return
    }

    let win = new BrowserWindow({
      width: WIN_CONF.width,
      height: WIN_CONF.height,
      useContentSize: true,
      titleBarStyle: 'hidden',
      webPreferences: {
        webSecurity: false, // true时会影响 info.ashx 请求用户信息
        nodeIntegration: true, // 解决require is not defined问题
        webviewTag: true // 解决webview无法显示问题
      }
    })

    win.on('close', () => {
      win = null
    })

    const url = `${getUrl(routeName)}?link=${encodeURIComponent(link)}`
    win.loadURL(url)
  })
}

export default function() {
  createProjectService()
  createProjectWebview()
}
