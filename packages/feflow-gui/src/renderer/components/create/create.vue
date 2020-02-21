<template>
  <div class="create-inner">
    <el-form label-position="left" label-width="140px" ref="form" :model="formData">
      <el-form-item label="脚手架">
        <el-select v-model="targetGenerator" placeholder="请选择">
          <el-option
            v-for="item in generators"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <div v-for="(field, index) in rule" v-bind:key="index">
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
      <el-button>取消</el-button>
      <el-button type="primary" @click="handleClick">创建</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'create-page',
  data() {
    return {
      targetGenerator: '',
      generators: [],
      formData: {},
      generatorsConfig: {}
    }
  },
  mounted() {
    // 获取脚手架
    this.$store.dispatch('getGenerator')
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

    this.targetGenerator = list[0]
  },
  computed: {
    formConfig() {
      const _formConfig = this.generatorsConfig[this.targetGenerator] || {}

      const { properties = [] } = _formConfig
      const formDataFromConfig = {}
      properties.map(item => (formDataFromConfig[item.field] = item.default || ''))
      this.formData = formDataFromConfig

      return _formConfig
    },
    rule() {
      // 读取选中脚手架的配置
      const { properties = [] } = this.formConfig || {}
      return properties
    }
  },
  methods: {
    handleClick() {
      // 创建配置文件
      this.$store.dispatch('builConfig', {
        config: this.formData,
        genConfig: this.generatorsConfig[this.targetGenerator]
      })
      // 执行脚手架初始化命令
      this.$store.dispatch('loadGenerator')
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
    onSubmit(formData) {
      // TODO 提交表单
    },
    updateForm(fieldName, value) {
      this.formData[fieldName] = value
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
}
.action-btn {
  border-top: 1px solid #f3f4f5;
  padding-top: 26px;
  display: flex;
  justify-content: flex-end;
  /* float: right; */
}
</style>

