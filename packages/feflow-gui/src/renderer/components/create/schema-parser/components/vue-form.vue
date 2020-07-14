<template>
  <div class="vue-form">
    <component :is="theme">
      <slot />
    </component>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Horizontal from './layout/horizontal.vue';

const { mapActions } = createNamespacedHelpers('Schema');

export default {
  components: {
    bootstrap: Horizontal,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
    definition: {
      type: Array,
    },
    model: [Object, Array],
    theme: {
      type: String,
      default: 'bootstrap',
    },
  },
  watch: {
    schema(newSchema) {
      const { definition, model } = this;
      this.init({ schema: newSchema, definition, model });
    },
  },
  created: function () {
    const { schema, definition, model } = this;
    this.init({ schema, definition, model });
  },
  methods: {
    ...mapActions(['init']),
  },
};
</script>
