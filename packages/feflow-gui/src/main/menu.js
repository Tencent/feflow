const { Menu, shell } = require('electron')

// 文档 https://electronjs.org/docs/api/menu-item
// 菜单项目
let menus = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+Shift+N',
        click: function () {
          // open new window
        }
      },
      {
        label: 'Open Folder',
        accelerator: 'CmdOrCtrl+O',
        click: function () {
         // open project file
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Copy',
        role: 'copy'
      },
      {
        label: 'Cut',
        role: 'cut'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:',
        role: 'selectall'
      }
    ]
  },
  {
    label: 'Window',
    submenu: [
      {
        role: 'minimize'
      }, {
        role: 'zoomin'
      }, {
        role: 'zoomout'
      }, {
        label: 'resetZoom',
        role: 'resetZoom'
      }, {
        type: 'separator'
      }, {
        role: 'front'
      }, {
        role: 'quit'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Keyboard Shortcuts',
        accelerator: 'CmdOrCtrl+/',
        enabled: true,
        click () {
          // showKeyboardHelp()
        }
      }, {
        type: 'separator'
      }, {
        label: 'Feflow Help',
        click () {
          shell.openExternal('https://github.com/Tencent/feflow')
        }
      }, {
        label: 'Report Issues',
        click () {
          shell.openExternal('https://github.com/Tencent/feflow/issues')
        }
      },
      {
        role: 'reload',
        accelerator: 'CmdOrCtrl+R'
      }, {
        role: 'toggledevtools'
      }
    ]
  }
]

let m = Menu.buildFromTemplate(menus)
Menu.setApplicationMenu(m)
