<template>
  <input
    type="hidden"
    class="form-control vue-form-input"
    v-model="value"
    :maxlength="schema.maxlength"
    :minLength="schema.minLength"
    :name="name"
    :pattern="schema.pattern"
    :required="definition.required"
  />
</template>

<script>
import basicMixin from '../mixins/basic.js'

export default {
  mixins: [basicMixin]
}
</script>
