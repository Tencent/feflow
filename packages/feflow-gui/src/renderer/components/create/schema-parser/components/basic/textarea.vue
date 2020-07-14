<template>
  <el-input
    v-model.lazy="value"
    type="textarea"
    class="form-control vue-form-input"
    :placeholder="definition.placeholder"
    :disabled="definition.disabled"
    :maxlength="schema.maxlength"
    :min-length="schema.minLength"
    :name="name"
    :readonly="definition.readonly"
    :required="definition.required"
    :rows="definition.row || 3"
  />
</template>

<script>
import basicMixin from '../mixins/basic.js';

export default {
  mixins: [basicMixin],
};
</script>
