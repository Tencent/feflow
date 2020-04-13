<template>
  <el-select
    v-model="option"
    @change="handleChange"
    :disabled="definition.disabled"
    :placeholder="definition.placeholder"
    :multiple="config.multiple"
    :pushTags="config.pushTags"
  >
    <el-option
      v-for="option in definition.options"
      :value="option.value"
      :key="option.value"
      :disabled="isWorking"
    />
  </el-select>
</template>

<script>
import _ from 'lodash'
import extend from 'extend'
import basicMixin from '../mixins/basic.js'

const defaults = {
  maxHeight: '400px',
  searchable: true,
  multiple: false,
  taggable: false,
  pushTags: false,
  filterable: true,
  noDrop: false
}

export default {
  data() {
    return {
      option: _.get(this.model, this.path)
    }
  },
  methods: {
    handleChange(value) {
      this.setValue({ path: this.path, value: value })
    }
  },
  computed: {
    config() {
      return extend(true, {}, defaults, this.definition.config)
    }
  },
  mixins: [basicMixin]
}
</script>
