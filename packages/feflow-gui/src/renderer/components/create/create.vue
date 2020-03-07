<template>
  <div class="create-inner">
    <el-form label-position="left" label-width="140px" ref="form" :model="formData">
      <el-form-item label="脚手架">
        <el-select v-model="targetGenerator" placeholder="请选择">
          <el-option
            :disabled="isWorking"
            v-for="item in generators"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目目录" v-if="!!targetGenerator">
        <el-input :value="workSpace" :disabled="true">
          <el-button @click="handleWorkSpaceClick" slot="append" :disabled="isWorking">选择</el-button>
        </el-input>
      </el-form-item>
      <div v-for="(field, index) in formConfig" v-bind:key="index">
        <el-form-item :label="field.title" v-if="shouldShow(field)">
          <el-col>
            <component
              v-if="field.type !== 'select'"
              :key="index"
              :is="'el-' + field.type"
              :label="field.title"
              :value="formData[field.field]"
              :multiple="field.multiple"
              @input="updateForm(field.field, $event)"
              v-bind="field"
              :options="field.options"
              :ref="field.title"
              :placeholder="field.description"
              :disabled="isWorking"
            ></component>

            <el-select
              v-else
              :value="formData[field.field]"
              @input="updateForm(field.field, $event)"
            >
              <el-option
                v-for="item in field.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </div>
    </el-form>

    <div class="action-btn">
      <el-button @click="handleReset" :disabled="isWorking">重置</el-button>
      <el-button type="primary" @click="handleClick" :disabled="isWorking">创建</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { CREATE_CODE } from '../../bridge/constants'

export default {
  name: 'create-page',
  data() {
    return {
      targetGenerator: '',
      generators: [],
      formData: {},
      generatorsConfig: {},
      isWorking: false
    }
  },
  mounted() {},
  created() {
    // 载入脚手架
    this.init()
    // 初始化表单配置
    this.loadFormInitData()
  },
  computed: {
    targetGeneratorConfig() {
      return this.generatorsConfig[this.targetGenerator] || {}
    },
    formConfig() {
      // 读取选中脚手架的配置
      return this.targetGeneratorConfig.properties || []
    },
    ...mapState({
      workSpace: state => state.Generator.workSpace
    })
  },
  watch: {},
  methods: {
    ...mapActions(['builConfig', 'getGenerator', 'selectWorkSpace', 'resetState']),
    init() {
      // 获取脚手架
      this.getGenerator()
      this.resetState()
      const { list, configMap } = this.$store.state.Generator
      const gens = Object.keys(configMap)

      Array.isArray(gens) &&
        gens.forEach(genName => {
          const key = genName
          const gen = configMap[genName]

          this.generators.push({
            value: key,
            label: gen.description
          })

          this.generatorsConfig[key] = configMap[key]
        })
      // 默认加载第一个脚手架
      this.targetGenerator = list[0]
    },
    loadFormInitData() {
      const formDataFromConfig = {}
      this.formConfig.forEach(item => (formDataFromConfig[item.field] = item.default))
      this.formData = formDataFromConfig
    },
    async handleClick() {
      const { execType } = this.generatorsConfig[this.targetGenerator]
      const isValid = await this.checkFormData()

      if (!isValid || this.messageInstance) return

      // 创建配置文件
      if (execType === 'path') {
        this.builConfig({
          config: this.formData,
          genConfig: this.generatorsConfig[this.targetGenerator]
        })
      }

      if (this.messageInstance) {
        this.messageInstance.close()
        this.messageInstance = null
      }

      this.messageInstance = this.toast('脚手架生成中, 请稍等', '', 'info', true)

      this.isWorking = true

      // 直接传参
      // 执行脚手架初始化命令
      this.$store
        .dispatchPromise('initGenerator', {
          execType,
          config: this.formData,
          generator: this.targetGenerator
        })
        .then(code => this.handleInitCode(code))
    },
    async checkFormData() {
      let errMsg = []
      let isValidWorkspace = false
      // 表单校验
      this.formConfig.forEach(({ isRequire, title, regex = '.*', field }) => {
        let value = this.formData[field]
        if (value === undefined && isRequire) {
          errMsg.push(`${title} 不能为空`)
        }
        if (!new RegExp(regex).test(this.formData[field])) {
          errMsg.push(`${title} 格式不正确`)
        }
      })

      if (errMsg.length) {
        this.$notify.error({
          title: '表单输入错误',
          message: errMsg[0],
          duration: 0
        })
      }

      // 项目路径检查
      if (this.formData.name && this.workSpace) {
        const initCode = await this.$store.dispatchPromise('checkBeforeRun', {
          name: this.formData.name,
          workSpace: this.workSpace
        })
        this.handleInitCode(initCode)
        isValidWorkspace = initCode === CREATE_CODE.CHECK_SUCCESS
      }

      return !errMsg.length && isValidWorkspace
    },
    shouldShow(field) {
      const requireList = field.require
      let result = true
      // 错误类型
      if (!Array.isArray(requireList)) {
        return result
      }
      // 空值
      if (requireList.length === 0) {
        return result
      }
      requireList.forEach(item => {
        if (!this.formData[item]) {
          result = false
        }
      })
      return result
    },
    updateForm(fieldName, value) {
      this.formData[fieldName] = value
    },
    handleWorkSpaceClick() {
      this.selectWorkSpace()
    },
    // 处理响应码
    handleInitCode(initCode) {
      if (initCode === CREATE_CODE.CHECK_SUCCESS) return
      switch (initCode) {
        case CREATE_CODE.SUCCESS: {
          this.messageInstance && this.messageInstance.close()
          this.handleReset()
          this.toast('项目创建成功', '', 'success')
          break
        }
        case CREATE_CODE.INVALID_WORKSPACE_NOT_EMPTY: {
          this.toast('项目创建失败', '项目路径重复，请修改项目名', 'error')
          break
        }
        default: {
          this.handleReset()
        }
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
    },
    async handleReset() {
      // 重置表单， 防止重复初始化项目
      this.formData = {}
      this.isWorking = false

      // 重置脚手架状态
      this.resetState()
    }
  }
}
</script>


<style scoped>
.create-inner {
  width: 100%;
  height: 500px;
  overflow: scroll;
  padding-bottom: 20px;
  box-sizing: border-box;
  padding-right: 24px;
}
.action-btn {
  border-top: 1px solid #f3f4f5;
  padding-top: 26px;
  display: flex;
  justify-content: flex-end;
  /* float: right; */
}
</style>

