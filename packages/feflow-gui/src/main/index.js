'use strict'

import path from 'path'
import { app, BrowserWindow } from 'electron'
import { getUrl } from './common/utils'
import registerEvent from './event'
import createServer from './common/utils/server'

/**
 *
 * In case if you enabled createSharedMutations() plugin
 * you need to create an instance of store in the main process.
 * To do it just add this line into your main process (for example src/main.js):
 * import './path/to/your/store'
 *
 * from https://github.com/vue-electron/vuex-electron#installation
 */

import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = getUrl()
const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  const dockIcon = path.join(__dirname, '../../build/icons/256X256.png')
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 840,
    webPreferences: { webSecurity: false },
    titleBarStyle: 'hidden',
    icon: dockIcon
  })

  if (process.platform === 'darwin') {
    app.dock.setIcon(dockIcon)
  }

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 进程通信中心
  registerEvent()
  global.isUsingWhistle = {
    value: false
  }
}

app.on('ready', () => {
  if (isDev) {
    createWindow()
  } else {
    createServer()
    setTimeout(() => {
      createWindow()
    }, 200)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
app.on('ready', () => {
  require('./menu.js')
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
