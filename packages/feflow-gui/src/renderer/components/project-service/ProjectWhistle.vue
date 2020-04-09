<template>
  <div class="project-whistle">
    <div class="project-whistle__row">
      <el-button class="project-whistle__icon" type="primary" icon="el-icon-plus" @click="handelDialog(true)" round>新增</el-button>
      <el-button class="project-whistle__icon" type="primary" icon="el-icon-setting" @click="runWhistle" round>启动</el-button>
    </div>
      <div class="project-whistle__main">
        <div class="project-whistle__menu">
          <div :class="['project-whistle__item', index === currentIndex && 'project-whistle__color']" v-for="(item, index) in proxyList" @click="changeProxyConfig(index)">
            <div class="project-whistle__name">
              <span class="project-whistle__current"><i v-if="item.id == selectId" class="el-icon-circle-check"></i></span>
              <span class="project-whistle__text">{{item.name}}</span>
<!--              <el-input v-else class="project-whistle__text" type="text" v-model="editName"></el-input>-->
            </div>
            <div class="project-whistle__btn">
<!--              <i class="el-icon-edit project-whistle__margin" @click="editProxyName"></i>-->
              <i class="el-icon-delete" @click="deleteProxy(item.id, index)"></i>
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
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="代理规则配置">
            <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入需要配置的代理"
                    v-model="form.configStr">
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
  getProjectProxy,
  updateProjectProxy
} from '../../bridge'
import {
  getUrlParam
} from '../../common/utils'

export default {
  name: 'project-whistle',
  data() {
    return {
      proxy: {},
      proxyList: [],
      showDialog: false,
      form: {}, // 创建测试环境
      selectId: 1,
      editConfig: '',
      currentIndex: 0,
      editProxy: ''
    }
  },
  computed: {
    lastProxy() {
      return this.proxyList.slice(-1)[0] || {}
    },
    lastId() {
      return this.lastProxy.id || 0
    },
    currentProxy() {
      return this.proxyList[this.currentIndex]
    }
  },
  mounted () {
    this.projectName = getUrlParam('name')
    this.proxy = getProjectProxy(this.projectName) || {}
    this.proxyList = this.proxy.list || []
    this.editProxy = (this.proxyList[0].config || []).join('\n')
    this.selectId = this.proxy.select || 1
  },
  methods: {
    // 切换测试环境
    handelSelect() {
      this.selectId = this.currentProxy.id
      this.doSave()
    },
    // 切换右侧展示proxy
    changeProxyConfig(index) {
       this.currentIndex = index
       this.editProxy = (this.proxyList[index].config || []).join('\n')
    },
    // 删除测试环境
    deleteProxy(id, index) {
      this.proxyList.splice(index, 1)
      if (this.selectId === id) {
        this.selectId = this.proxyList[0].id || 1
      }
      if (this.currentIndex === index) {
        this.changeProxyConfig(0)
      }
      this.doSave()
    },
    // 创建弹窗
    handelDialog(status) {
      this.form = {}
      this.showDialog = status
    },
    // 新增测试环境
    handelAddProxy() {
      this.form.id = this.lastId + 1
      this.form.config = this.form.configStr.split('\n') || []
      delete this.form.configStr
      this.proxyList.push(this.form)
      this.doSave()
      this.handelDialog(false)
    },
    // 修改proxy
    handelSave() {
      let currentProxy = this.currentProxy || {}
      currentProxy.config = this.editProxy.split('\n')
      this.doSave()
    },
    // 取消修改
    handelCancel() {
      this.editProxy = (this.currentProxy.config || []).join('\n')
    },
    doSave() {
      updateProjectProxy(this.projectName, {
        select: this.selectId,
        list: this.proxyList
      })
    },
    runWhistle() {
      // 启动whistle
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../assets/less/_function";

.project-whistle {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__row {
    padding: 20px;
    background: #F3F4F5;
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
  &__margin{
    margin-right: 8px;
  }
  &__content {
    display: flex;
    flex-direction: column;
    background: #F3F4F5;
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
    color: #767E97;
    border-radius: 4px;
  }
}
</style>
