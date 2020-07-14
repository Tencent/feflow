<template>
  <el-form
    v-if="definition.length > 0"
    class="form-horizontal"
    label-position="left"
    label-width="140px"
    @submit.prevent
  >
    <div
      v-for="(group, idx) in definition"
      :key="`${(group && group.key) ? group.key.join('.') : ''}-${idx}`"
      :label="(group || {}).title"
    >
      <form-group
        v-if="group"
        :definition="group"
        :show-type="showType"
      />
      <slot />
    </div>
  </el-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import '../factory/factory.js';
import '../basic/fieldset.js';
import '../basic/array.js';
import '../basic/inline.js';

const { mapState } = createNamespacedHelpers('Schema');

export default {
  computed: mapState({
    definition: state => state.definition,
    showType: state => state.schema.showType,
  }),
};
</script>
