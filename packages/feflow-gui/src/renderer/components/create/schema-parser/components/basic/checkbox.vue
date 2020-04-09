<template>
  <div class="checkbox">
    <el-switch
      v-model.lazy="value"
      :disabled="isWorking"
      :name="name"
      :readonly="definition.readonly"
      :required="definition.required"
    />
  </div>
</template>

<script>
import basicMixin from '../mixins/basic.js'

export default {
  mixins: [basicMixin]
}
</script>
