<template>
  <input
    v-model="value"
    type="hidden"
    class="form-control vue-form-input"
    :maxlength="schema.maxlength"
    :minLength="schema.minLength"
    :name="name"
    :pattern="schema.pattern"
    :required="definition.required"
  >
</template>

<script>
import basicMixin from '../mixins/basic.js';

export default {
  mixins: [basicMixin],
};
</script>
