<template>
  <div>
    <el-checkbox-group
      class="vue-form-input"
      v-model="value"
      :value="item.value"
      :true-value="item.value"
      :disabled="definition.disabled"
      :name="name"
      :readonly="definition.readonly"
      :lazy="definition.lazy === false ? false : true"
    >
      <el-checkbox v-for="option in definition.options" :value="option.value" :key="option.value" />
    </el-checkbox-group>
  </div>
</template>

<script>
import basicMixin from '../mixins/basic.js'
import _ from 'lodash'

export default {
  mixins: [basicMixin],
  computed: {
    value: {
      get() {
        return _.get(this.model, this.path) || []
      },
      set(val) {
        // 无值
        if (val === '') {
          this.removeValue(this.path)
        } else {
          this.setValue({ path: this.path, value: val })
        }
      }
    }
  }
}
</script>
