/**
 * 主线程与渲染线程的通信
 * @description 注册通信事件
 */
import { ipcMain, BrowserWindow } from 'electron'
import { getUrl } from '../common'

// GUI 统一参数
const WIN_CONF = {
  width: 840,
  height: 640
}
/**
 * 打开项目服务窗口
 */
function createProjectService () {
  ipcMain.on('create-project-service', (event, { routeName, projectPath }) => {
    if (!routeName || !projectPath) {
      return
    }

    let win = new BrowserWindow({
      width: WIN_CONF.width,
      height: WIN_CONF.height
    })

    win.on('close', () => {
      win = null
    })
    const url = `${getUrl(routeName)}?path=${projectPath}`
    win.loadURL(url)
  })
}

export default function () {
  createProjectService()
}
