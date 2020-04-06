<template>
  <el-form class="form-horizontal" @submit.prevent label-position="left" label-width="140px">
    <div
      :label="group.title"
      v-for="(group, idx) in definition"
      :key="`${group.key ? group.key.join('.') : ''}-${idx}`"
    >
      <form-group :definition="group"></form-group>
      <slot></slot>
    </div>
  </el-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import '../factory/factory.js'
import '../basic/fieldset.js'
import '../basic/array.js'
import '../basic/inline.js'

const { mapState } = createNamespacedHelpers('Schema')

export default {
  computed: mapState({
    definition: state => state.definition
  })
}
</script>
