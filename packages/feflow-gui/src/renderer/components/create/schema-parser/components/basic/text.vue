<template>
  <el-input
    type="text"
    class="form-control spark-input"
    v-model.lazy="value"
    :placeholder="definition.placeholder"
    :disabled="definition.disabled"
    :maxlength="schema.maxlength"
    :minLength="schema.minLength"
    :name="name"
    :pattern="schema.pattern"
    :readonly="definition.readonly"
    :required="definition.required"
  />
</template>

<script>
import basicMixin from '../mixins/basic.js'

export default {
  mixins: [basicMixin]
}
</script>
