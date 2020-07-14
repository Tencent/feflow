<template>
  <el-input
    v-model.lazy="value"
    type="text"
    class="form-control spark-input"
    :placeholder="definition.placeholder"
    :disabled="isWorking"
    :maxlength="schema.maxlength"
    :min-length="schema.minLength"
    :name="name"
    :pattern="schema.pattern"
    :readonly="definition.readonly"
    :required="definition.required"
  />
</template>

<script>
import basicMixin from '../mixins/basic.js';

export default {
  mixins: [basicMixin],
};
</script>
