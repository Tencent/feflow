<template>
  <el-input-number
    v-model="number"
    :placeholder="definition.placeholder"
    :disabled="definition.disabled"
    :max="schema.max"
    :min="schema.min"
    :readonly="definition.readonly"
    :required="definition.required"
    @change="handleChange"
  />
</template>

<script>
import basicMixin from '../mixins/basic.js'

export default {
  mixins: [basicMixin],
  data() {
    return {
      number: _.get(this.model, this.path) || 0
    }
  },
  methods: {
    handleChange(value) {
      this.setValue({ path: this.path, value: value })
    }
  }
}
</script>
