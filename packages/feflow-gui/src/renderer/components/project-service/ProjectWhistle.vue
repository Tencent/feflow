<template>
  <div class="project-whistle">
    <div class="project-whistle__row">
      <div class="project-whistle__side">
        <el-button class="project-whistle__button" type="success" @click="handelDialog(true)">
          <i class="el-icon-plus"></i>新增
        </el-button>
        <el-button class="project-whistle__button" type="primary" @click="runWhistle" :disabled="startStatus !==0 ">
          <i :class="startStatus === 1?'el-icon-loading':'el-icon-base el-icon-start'"></i>{{startStatus === 1?'启动中':'启动'}}
        </el-button>
        <el-button class="project-whistle__button" type="danger" @click="closeWhistle" :disabled="startStatus !== 2">
          <i :class="startStatus === 3?'el-icon-loading':'el-icon-base el-icon-pause'"></i>{{startStatus === 3?'停止中':'停止'}}
        </el-button>
      </div>
      <div class="project-whistle__side">
        <span class="project-whistle__font">whistle端口：</span>
        <el-input class="project-whistle__port" v-model="whistlePort" :disabled="!isEditPort"></el-input>
        <i class="el-icon-edit project-whistle__icon" @click="editProxyPort"></i>
        <i class="el-icon-check project-whistle__icon" @click="saveProxyPort"></i>
      </div>
    </div>
    <span class="project-whistle__line"></span>
      <div class="project-whistle__main">
        <div class="project-whistle__menu">
          <div :class="['project-whistle__item', index === currentIndex && 'project-whistle__current']" v-for="(item, index) in completeProxyList" @click="changeProxyConfig(index)">
            <div class="project-whistle__name">
              <span class="project-whistle__select"><i v-if="item.id == selectId" class="el-icon-blue-check"></i></span>
              <span class="project-whistle__text">{{item.name}}</span>
              <img v-if="item.isDefault" class="project-whistle__baseicon" v-bind:src="require('../../assets/img/whistle/base.png')" />
            </div>
            <div class="project-whistle__btn">
              <i class="el-icon-close" @click.stop="deleteProxy(item, index)"></i>
            </div>
          </div>
        </div>
        <div class="project-whistle__content">
          <div class="project-whistle__operation">
              <div class="project-whistle__side">
                <el-button class="project-whistle__button" plain icon="el-icon-refresh" @click="handelSelect">切换</el-button>
                <el-button class="project-whistle__button" plain @click="handelCancel"><i class="el-icon-base el-icon-undo"></i>撤销</el-button>
              </div>
              <el-button class="project-whistle__button" type="primary" plain @click="handelSave"><i class="el-icon-base el-icon-save"></i>保存</el-button>
          </div>
          <div class="project-whistle__textarea">
            <el-input
                    type="textarea"
                    :rows="18"
                    placeholder="请输入需要配置的代理"
                    v-model="editProxy">
            </el-input>
          </div>
        </div>
      </div>
      <el-dialog class="project-whistle__dialog" title="添加测试环境" :visible.sync="showDialog">
        <el-form :model="form">
          <div class="project-whistle__form">
            <span class="project-whistle__form-title">测试环境名称</span>
            <el-input class="project-whistle__form-input" v-model="form.name"></el-input>
          </div>
          <div class="project-whistle__form project-whistle__form-radio">
            <span class="project-whistle__form-title">是否为通用代理</span>
            <el-radio v-model="form.isDefault" label="1">是</el-radio>
            <el-radio v-model="form.isDefault" label="0">否</el-radio>
          </div>
          <div class="project-whistle__form">
            <span class="project-whistle__form-title">代理规则配置</span>
            <el-input
                    class="project-whistle__form-textarea"
                    type="textarea"
                    :rows="10"
                    placeholder="请输入需要配置的代理"
                    v-model="form.rules">
            </el-input>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handelDialog(false)">取消</el-button>
          <el-button type="primary" @click="handelAddProxy">添加</el-button>
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
      this.$message({
        type: 'success',
        message: 'whistle配置切换成功！'
      })
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
      this.$message({
        type: 'success',
        message: '测试环境增加成功！'
      })
    },
    // 修改proxy
    handelSave() {
      this.currentProxy.rules = this.editProxy
      if (this.currentProxy.isDefault) {
        this.doSaveDefault()
      } else {
        this.doSavePersonal()
      }
      this.$message({
        type: 'success',
        message: '测试环境保存成功！'
      })
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
  font-size: 12px;
  .el-button {
    line-height: 30px;
    height: 30px;
    font-size: 12px;
    padding: 0 15px;
  }
  .el-button--success {
    background: #22BCA9;
  }
  .el-icon-base {
    display: inline-block;
    vertical-align: middle;
    margin: -2px 5px 0;
    width: 10px;
    height: 12px;
  }
  .el-icon-start {
    background: url("../../assets/img/service-run.png") center no-repeat;
    background-size: 100% auto;
  }
  .el-icon-pause {
    background: url("../../assets/img/service-stop.png") center no-repeat;
    background-size: 100% auto;
  }
  .el-icon-save {
    margin: -3px 3px 0 0;
    width: 14px;
    height: 14px;
    background: url("../../assets/img/whistle/save.png") center no-repeat;
    background-size: 100% auto;
  }
  .el-icon-undo {
    margin: -3px 3px 0 0;
    width: 12px;
    height: 12px;
    background: url("../../assets/img/whistle/undo.png") center no-repeat;
    background-size: 100% auto;
  }
  &__icon {
    margin-right: 12px;
  }
  &__button {
    margin-right: 12px;
     i {
       margin-right: 3px;
     }
  }
  &__font {
    color: #434650;
  }
  &__row {
    width: 100%;
    padding: 25px 30px 20px 22px;
    background: #FFFFFF;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
  }
  &__side {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &__port{
    width: 80px;
    margin-right: 12px;
  }
  &__port /deep/ .el-input__inner {
    height: 30px;
  }
  &__line {
    height: 1px;
    background: #F3F4F5;
  }
  &__main {
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  &__menu {
    width: 131px;
    background: #F3F4F5;
    margin-right: 36px;
  }
  &__item {
    height: 40px;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  &__current {
    background-color: #E8EAEE;
    border-right: 2px solid #434650;;
  }
  &__name {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  &__select {
    display: inline-block;
    width: 12px;
    .el-icon-blue-check {
      width: 12px;
      height: 12px;
      background: url(../../assets/img/whistle/selected.png) center center no-repeat;
    }
  }
  &__text {
    margin-left: 6px;
  }
  &__baseicon {
    margin-left: 4px;
    width: 24px;
    height: 12px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    background: #ffffff;
  }
  &__operation {
    padding-bottom: 16px;
    padding-top: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  &__textarea {
    box-sizing: border-box;
    width: 462px;
    border-radius: 4px;
  }
  &__textarea /deep/ .el-textarea__inner {
    background: #F3F4F5;
    border: none;
  }
  &__dialog /deep/ .el-dialog__title {
    font-weight: bold;
  }
  &__form {
    display: flex;
    flex-direction: row;
    &-title {
      width: 84px;
      text-align: right;
      font-size: 12px;
      color: #434650;
      margin-right: 18px;
    }
    &-input {
      width: 340px;
      /deep/ .el-input__inner{
        background: #F3F4F5;
        border-radius: 4px;
        border: none;
      }
    }
    &-textarea {
      width: 340px;
      /deep/ .el-textarea__inner{
        background: #F3F4F5;
        border-radius: 4px;
        border: none;
      }
    }
    &-radio {
      padding-top: 27px;
      padding-bottom: 27px;
    }
  }
}
</style>
