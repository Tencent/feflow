<template>
  <div>
    <el-form :label-position="labelPosition" label-width="80px" ref="form" :model="formData">
      <el-form-item v-for="(field, index) in rule" v-bind:key="index" :label="field.title">
        <el-col>
          <component
            :key="index"
            :is="'el-' +field.type"
            :label="field.title"
            :value="formData[field.title]"
            :multiple="field.multiple"
            @input="updateForm"
            v-bind="field"
            :options="field.options"
            :ref="field.title"
          ></component>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'create-page',
  // components: { SideBar },
  data() {
    return {
      activeName: 'create',
      labelPosition: 'right',
      vmForm: {},
      formData: {
        goodsName: '',
        goodsDescription: ''
      },
      // 表单生成规则
      rule: [
        {
          type: 'input',
          field: 'goods_name',
          title: '商品名称'
        },
        {
          type: 'input',
          field: 'goods_description',
          title: '商品描述'
        }
      ]
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
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


<style>
</style>

