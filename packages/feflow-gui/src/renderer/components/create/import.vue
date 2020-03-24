<template>
  <div class="import-wrapper">
    <el-form label-position="left" label-width="140px" ref="form">
      <el-form-item label="项目名称">
        <el-input v-model="name" placeholder="请输入内容" clearable />
      </el-form-item>
      <el-form-item label="项目截图">
        <el-input v-model="banner" placeholder="图片链接" clearable />
      </el-form-item>
      <el-form-item label="目录">
        <el-input :value="workSpace" :disabled="true">
          <el-button @click="handleWorkSpaceClick" slot="append" class="workspace_btn">选择</el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <div class="action-btn">
      <el-button @click="handleReset">重置</el-button>
      <el-button
        type="primary"
        @click="handleClick"
        :disabled="!(!!this.name && !!this.workSpace)"
      >导入</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { saveGeneratorConfig } from '../../bridge'

export default {
  name: 'import-page',
  data() {
    return {
      name: '',
      banner: ''
    }
  },
  computed: {
    ...mapState({
      workSpace: state => state.Generator.importWorkSpace,
      projectListFromConfig: state => state.Generator.projectListFromConfig
    })
  },
  created() {
    // 载入已有项目清单
    this.getProjectListFromConfig()
    // 清空导入工作目录
    this.handleReset()
  },
  methods: {
    ...mapActions(['importWorkSpace', 'getProjectListFromConfig', 'resetState']),
    handleWorkSpaceClick() {
      this.importWorkSpace()
    },
    handleClick() {
      // 校验是否已经存在
      // 名称和目录
      if (!this.check()) return

      // 导入项目
      saveGeneratorConfig({ projectName: this.name, workSpace: this.workSpace, banner: this.banner })
      this.toast('导入成功', '', 'success')
      this.handleReset()
    },
    check() {
      const projectName = []
      const projectPath = []
      Object.keys(this.projectListFromConfig).forEach(key => {
        projectName.push(key)
        projectPath.push(this.projectListFromConfig[key].path)
      })

      if (this.banner) {
        if (!/(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?/.test(this.banner)) {
          this.toast('表单错误', '图片链接格式有误', 'error')
          return false
        }
      }

      if (projectName.indexOf(this.name) >= 0) {
        this.toast('导入失败', '项目名重复', 'error')
        return false
      }

      if (projectPath.indexOf(this.workSpace) >= 0) {
        this.toast('导入失败', '该路径下的项目已导入', 'error')
        return false
      }
      return true
    },
    handleReset() {
      this.name = ''
      this.resetState()
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
</script>

<style scoped lang="less">
.import-wrapper {
  width: 100%;
  height: 500px;
  overflow: scroll;
  padding-bottom: 20px;
  box-sizing: border-box;
  padding-right: 24px;
  /* padding-top: 118px; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .workspace_btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: #fff;
    padding: 13px 20px;
    background-color: #409eff;
    border-color: #409eff;
  }
}
.action-btn {
  border-top: 1px solid #f3f4f5;
  /* margin-top: 130px; */
  padding-top: 26px;
  display: flex;
  justify-content: flex-end;
}
</style>