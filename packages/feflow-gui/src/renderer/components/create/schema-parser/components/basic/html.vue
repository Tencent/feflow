<template>
  <div
    class="vue-form-html"
    v-html="definition.tpl"
  />
</template>

<script>
export default {
  props: {
    definition: {
      type: Object,
    },
  },
};
</script>
