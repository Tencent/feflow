<template>
  <el-form
    class="form-horizontal"
    v-if="definition.length > 0"
    @submit.prevent
    label-position="left"
    label-width="140px"
  >
    <div
      v-for="(group, idx) in definition"
      :label="(group || {}).title"
      :key="`${(group && group.key) ? group.key.join('.') : ''}-${idx}`"
    >
      <form-group v-if="group" :definition="group" :showType="showType"></form-group>
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
    definition: state => state.definition,
    showType: state => state.schema.showType
  })
}
</script>
