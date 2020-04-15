<template>
  <div class="vue-form">
    <component :is="theme">
      <slot></slot>
    </component>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Horizontal from './layout/horizontal.vue'

const { mapActions } = createNamespacedHelpers('Schema')

export default {
  props: {
    schema: {
      type: Object,
      required: true
    },
    definition: {
      type: Array
    },
    model: [Object, Array],
    theme: {
      type: String,
      default: 'bootstrap'
    }
  },
  created: function() {
    const { schema, definition, model } = this
    this.init({ schema, definition, model })
  },
  watch: {
    schema(newSchema) {
      const { definition, model } = this
      this.init({ schema: newSchema, definition, model })
    }
  },
  components: {
    bootstrap: Horizontal
  },
  methods: {
    ...mapActions(['init'])
  }
}
</script>
