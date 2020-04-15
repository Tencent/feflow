import { mapActions, mapState } from 'vuex'
import { installPlugin, unInstallPlugin } from '../../../bridge'

export default {
  data() {
    return {
      targetPkgName: ''
    }
  },
  computed: {
    ...mapState({
      taskMap: state => state.Market.taskMap
    })
  },
  methods: {
    ...mapActions(['getLocalPluginList', 'setTaskMap']),
    checkTaskValid(fullPkgName) {
      // 防止任务重复
      if (this.taskMap[fullPkgName]) {
        this.toast(`${fullPkgName}插件正在任务队列中, 请任务完成后再试`)
        return false
      }
      return true
    },
    handleInstallAction(isInstalled, fullPkgName) {
      const targetPkgName = fullPkgName
      const handleFn = !isInstalled ? installPlugin : unInstallPlugin
      this.setTaskMap({ key: fullPkgName, value: true })
      return new Promise(resolve => {
        const childProcess = handleFn(targetPkgName)
        childProcess.on('close', code => {
          this.setTaskMap({ key: fullPkgName, value: false })
          this.handleCode(code, isInstalled ? 'uninstall' : 'install', targetPkgName)
          resolve(code)
        })
      })
    },
    handleCode(code, type, targetPkgName) {
      const typeText = {
        install: {
          success: `${targetPkgName}安装成功`,
          fail: `${targetPkgName}安装失败`,
          failMessage: `请尝试手动下载 
          fef install ${targetPkgName}`
        },
        uninstall: {
          success: `${targetPkgName}卸载成功`,
          fail: `${targetPkgName}卸载失败`,
          failMessage: `请尝试手动卸载 
          fef uninstall ${targetPkgName}`
        }
      }

      const message = typeText[type]
      if (!message) {
        this.toast('类型错误：' + type, '', 'error')
        return
      }
      if (code === 0) {
        this.toast(message.success, '', 'success')
        // 再次再入
        this.getLocalPluginList()
      } else {
        this.toast(message.fail, message.failMessage, 'error')
      }
    },
    toast(title, msg, type = 'info', isPersistent = false) {
      let opt = {
        title,
        message: msg
      }
      if (isPersistent) {
        opt.duration = 0
      }

      return this.$notify[type](opt)
    }
  }
}
