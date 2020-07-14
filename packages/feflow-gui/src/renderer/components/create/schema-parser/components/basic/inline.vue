<template>
  <div class="row">
    <div
      v-for="(group, idx) in definition.items"
      :key="`${group.key ? group.key.join('.') : ''}-${idx}`"
      :class="[`col-xs-${group.col}`]"
    >
      <form-group :definition="group" />
    </div>
  </div>
</template>

<script>
import objectMixin from '../mixins/object.js';

export default {
  mixins: [objectMixin],
};
</script>

