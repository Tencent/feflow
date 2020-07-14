<template>
  <div class="fieldset">
    <form-group
      v-for="(group, idx) in definition.items"
      :key="`${(group && group.key) ? group.key.join('.') : ''}-${idx}`"
      :definition="group"
    />
  </div>
</template>

<script>
import objectMixin from '../mixins/object.js';

export default {
  mixins: [objectMixin],
};
</script>

