<template>
  <div>
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
      <el-button type="primary">创建</el-button>
    </div>
  </div>
</template>

<script>
import generatorsIvweb from './schema.ivweb.json'
import generatorNow from './schema.now.json'

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
    this.generatorsConfig[generatorNow.gererator] = generatorNow
    this.generatorsConfig[generatorsIvweb.gererator] = generatorsIvweb
    this.generators.push({
      value: generatorNow.gererator,
      label: generatorNow.description
    })
    this.generators.push({
      value: generatorsIvweb.gererator,
      label: generatorsIvweb.description
    })

    this.targetGenerator = generatorNow.gererator
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
    handleClick(tab, event) {
      console.log(tab, event)
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
.action-btn {
  border-top: 1px solid #f3f4f5;
  padding-top: 26px;
  display: flex;
  justify-content: flex-end;
  /* float: right; */
}
</style>

