<template>
  <div class="row">
    <div
      v-for="(group, idx) in definition.items"
      :class="[`col-xs-${group.col}`]"
      :key="`${group.key ? group.key.join('.') : ''}-${idx}`"
    >
      <form-group :definition="group"></form-group>
    </div>
  </div>
</template>

<script>
import objectMixin from '../mixins/object.js'

export default {
  mixins: [objectMixin]
}
</script>

