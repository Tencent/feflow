<template>
  <div class="project-whistle">
    <div class="project-whistle__row">
      <el-button class="project-whistle__icon" type="primary" icon="el-icon-plus" @click="handelDialog(true)" round>新增</el-button>
      <el-button class="project-whistle__icon" type="success" :icon="startStatus == 1?'el-icon-loading':'el-icon-setting'" @click="runWhistle" round :disabled="startStatus !==0 ">{{startStatus == 1?'启动中':'启动'}}</el-button>
      <el-button class="project-whistle__icon" type="danger" :icon="startStatus == 3?'el-icon-loading':'el-icon-close'" @click="closeWhistle" round :disabled="startStatus !== 2">{{startStatus == 3?'停止中':'停止'}}</el-button>
    </div>
    <div class="project-whistle__row2">
      <span>whistle端口：
      <el-input class="project-whistle__port" v-model="whistlePort" :disabled="!isEditPort"></el-input>
        <i class="el-icon-edit project-whistle__margin" @click="editProxyPort"></i>
        <i class="el-icon-check project-whistle__margin" @click="saveProxyPort"></i>
      </span>
    </div>

      <div class="project-whistle__main">
        <div class="project-whistle__menu">
          <div :class="['project-whistle__item', index === currentIndex && 'project-whistle__color']" v-for="(item, index) in completeProxyList" @click="changeProxyConfig(index)">
            <div class="project-whistle__name">
              <span class="project-whistle__current"><i v-if="item.id == selectId" class="el-icon-circle-check"></i></span>
              <span class="project-whistle__text">{{item.name}}</span>
            </div>
            <div class="project-whistle__btn">
              <i class="el-icon-delete" @click.stop="deleteProxy(item, index)"></i>
            </div>
          </div>
        </div>
        <div class="project-whistle__content">
          <div class="project-whistle__operation">
            <el-row>
              <el-button class="project-whistle__icon" type="primary" icon="el-icon-refresh" @click="handelSelect">切换</el-button>
              <el-button class="project-whistle__icon" type="danger" icon="el-icon-delete" @click="handelCancel">撤销</el-button>
              <el-button class="project-whistle__icon" type="success" icon="el-icon-check" @click="handelSave">保存</el-button>
            </el-row>
          </div>
          <div class="project-whistle__textarea">
            <el-input
                    type="textarea"
                    :rows="16"
                    placeholder="请输入需要配置的代理"
                    v-model="editProxy">
            </el-input>
          </div>
        </div>
      </div>
      <el-dialog title="添加测试环境" :visible.sync="showDialog">
        <el-form :model="form">
          <el-form-item label="测试环境名称:">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="是否为通用代理:">
            <el-radio v-model="form.isDefault" label="1">是</el-radio>
            <el-radio v-model="form.isDefault" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="代理规则配置">
            <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入需要配置的代理"
                    v-model="form.rules">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handelDialog(false)">取 消</el-button>
          <el-button type="primary" @click="handelAddProxy">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import {
  getFefProjectProxy,
  updateFefProjectProxy,
  getDefaultProjectProxy,
  updateDefaultProjectProxy,
  generatorWhistleJS
} from '../../bridge'
import { FEFLOW_WHISTLE_JS_PATH } from '../../bridge/constants'
import { spawn } from 'child_process'
import { getUrlParam } from '../../common/utils'

export default {
  name: 'project-whistle',
  data() {
    return {
      proxy: {},
      proxyList: [], // 个性化测试环境
      defaultProxy: [], // 基础测试环境
      completeProxyList: [],
      showDialog: false,
      form: {}, // 创建测试环境
      selectId: 1,
      editConfig: '',
      currentIndex: 0,
      editProxy: '',
      whistlePort: 0,
      isEditPort: false,
      startStatus: 0
    }
  },
  computed: {
    lastId() {
      let idList = []
      this.completeProxyList.map(item => {
        return idList.push(item.id)
      })
      return Math.max(...idList) || 0
    },
    currentProxy() {
      return this.completeProxyList[this.currentIndex]
    }
  },
  mounted() {
    this.projectPath = getUrlParam('path')
    this.projectName = getUrlParam('name')
    this.proxy = getFefProjectProxy(this.projectName)
    this.defaultProxy = getDefaultProjectProxy(this.projectPath)
    this.initWhistle()
  },
  methods: {
    initWhistle() {
      this.proxyList = this.proxy.list || []
      this.whistlePort = this.proxy.port || 8899
      this.completeProxyList = this.defaultProxy.concat(this.proxyList)
      this.editProxy = this.currentProxy.rules
      this.selectId = this.currentProxy.id || 0
      this.updateWhistleJS()
    },

    editProxyPort() {
      this.isEditPort = true
    },
    saveProxyPort() {
      this.isEditPort = false
      this.doSavePersonal()
    },
    // 切换测试环境
    handelSelect() {
      this.selectId = this.currentProxy.id
      this.updateWhistleJS()
    },
    // 切换右侧展示proxy
    changeProxyConfig(index) {
      this.currentIndex = index
      this.editProxy = this.completeProxyList[index].rules || ''
    },
    // 删除测试环境
    deleteProxy(item, index) {
      let delIndex = 0
      this.completeProxyList.splice(index, 1)
      if (this.selectId === item.id) {
        this.selectId = this.completeProxyList[0].id || 1
      }
      if (this.currentIndex === index) {
        this.changeProxyConfig(0)
      }
      if (item.isDefault) {
        delIndex = this.defaultProxy.findIndex(proxy => {
          return proxy.id === item.id
        })
        this.defaultProxy.splice(delIndex, 1)
        this.doSaveDefault()
      } else {
        delIndex = this.proxyList.findIndex(proxy => {
          return proxy.id === item.id
        })
        this.proxyList.splice(delIndex, 1)
        this.doSavePersonal()
      }
    },
    // 创建弹窗
    handelDialog(status) {
      this.form = { rules: (this.defaultProxy[0] || {}).rules || '' }
      this.showDialog = status
    },
    // 新增测试环境
    handelAddProxy() {
      if (!this.form.name) {
        this.$alert('请填写测试环境名称', '温馨提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.form.id = this.lastId + 1
      this.completeProxyList.push(this.form)
      this.form.isDefault = Number(this.form.isDefault)
      if (this.form.isDefault) {
        this.defaultProxy.push(this.form)
        this.doSaveDefault()
      } else {
        this.proxyList.push(this.form)
        this.doSavePersonal()
      }
      this.handelDialog(false)
    },
    // 修改proxy
    handelSave() {
      this.currentProxy.rules = this.editProxy
      if (this.currentProxy.isDefault) {
        this.doSaveDefault()
      } else {
        this.doSavePersonal()
      }
    },
    // 取消修改
    handelCancel() {
      this.editProxy = this.currentProxy.rules || ''
    },
    // 更新default配置
    doSaveDefault() {
      updateDefaultProjectProxy(this.projectPath, this.defaultProxy)
    },
    // 更新个性化配置
    doSavePersonal() {
      updateFefProjectProxy(this.projectName, {
        port: this.whistlePort,
        list: this.proxyList
      })
    },
    updateWhistleJS() {
      let config = this.completeProxyList.find(proxy => proxy.id === this.selectId)
      generatorWhistleJS({ name: config.name, rules: config.rules })
    },
    runWhistle() {
      this.startStatus = 1
      this.runCommand('start', () => {
        this.runCommand(`add ${FEFLOW_WHISTLE_JS_PATH} --force`, () => {
          this.startStatus = 2
          this.$electron.shell.openExternal(`http://127.0.0.1:${this.whistlePort}/`)
        })
      })
    },
    closeWhistle() {
      this.startStatus = 3
      this.runCommand('stop', () => {
        this.startStatus = 0
        console.log('kill success')
      })
    },
    // 运行命令
    runCommand(command, exitCallback) {
      const childProcess = spawn('w2', [command], {
        stdio: 'pipe',
        shell: true
      })
      childProcess.stdout.on('data', data => {})
      childProcess.on('close', data => {
        exitCallback && exitCallback()
      })
      return childProcess
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/less/_function';

.project-whistle {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__row {
    padding: 20px 20px 0;
    background: #f3f4f5;
  }
  &__row2 {
    padding: 10px 20px 20px;
    background: #f3f4f5;
  }
  &__port {
    width: 100px;
    margin-right: 6px;
  }
  &__main {
    padding-top: 20px;
    width: 660px;
    display: flex;
    flex-direction: row;
    overflow-y: visible;
  }
  &__menu {
    width: 160px;
    background: #b3c0d1;
    margin-right: 18px;
  }
  &__item {
    height: 38px;
    padding-left: 8px;
    padding-right: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  &__color {
    background-color: #e9eef3;
  }
  &__name {
    flex: 1;
  }
  &__current {
    display: inline-block;
    width: 14px;
  }
  &__text {
    margin-left: 6px;
  }
  &__margin {
    margin-right: 8px;
  }
  &__content {
    display: flex;
    flex-direction: column;
    background: #f3f4f5;
  }
  &__operation {
    padding-left: 20px;
    padding-top: 20px;
    &__icon {
      margin-right: 20px;
    }
  }
  &__textarea {
    box-sizing: border-box;
    padding: 20px;
    width: 480px;
    color: #767e97;
    border-radius: 4px;
  }
}
</style>
