<template>
  <div class="project-whistle">
      <div class="project-whistle__operation">
        <el-row>
<!--          <el-button class="project-whistle__icon" type="primary" icon="el-icon-edit" @click="handelEdit">编辑</el-button>-->
          <el-button class="project-whistle__icon" type="danger" icon="el-icon-delete" @click="handelCancel">撤销</el-button>
          <el-button class="project-whistle__icon" type="success" icon="el-icon-check" @click="handelSave">保存</el-button>
        </el-row>
      </div>
      <div class="project-whistle__textarea">
        <el-input
                type="textarea"
                :rows="16"
                placeholder="请输入需要配置的代理"
                v-model="proxyConfig">
        </el-input>
      </div>
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
      proxyList: [],
      proxyConfig: '',
      isEdit: false
    }
  },
  computed: {
  },
  mounted () {
    this.projectName = getUrlParam('name')
    this.proxyList = getProjectProxy(this.projectName)
    this.proxyConfig = this.proxyList.join('\n')
  },
  methods: {
    handelEdit() {
      this.isEdit = true
    },
    handelSave() {
      this.isEdit = false
      this.proxyList = this.proxyConfig.split('\n')
      updateProjectProxy(this.projectName, this.proxyList)
    },
    handelCancel() {
      this.proxyConfig = this.proxyList.join('\n')
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
  &__operation {
    padding: 20px;
    &__icon {
      margin-right: 20px;
    }
  }
  &__textarea {
    box-sizing: border-box;
    margin-left: 20px;
    padding: 20px;
    width: 480px;
    color: #767E97;
    background: #F3F4F5;
    border-radius: 4px;
  }
}
</style>
