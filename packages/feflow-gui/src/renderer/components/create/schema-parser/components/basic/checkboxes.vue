<template>
  <div>
    <el-checkbox-group
      v-model="value"
      class="vue-form-input"
      :value="item.value"
      :true-value="item.value"
      :disabled="isWorking"
      :name="name"
      :readonly="definition.readonly"
      :lazy="definition.lazy === false ? false : true"
    >
      <el-checkbox
        v-for="option in definition.options"
        :key="option.value"
        :value="option.value"
      />
    </el-checkbox-group>
  </div>
</template>

<script>
import basicMixin from '../mixins/basic.js';
import _ from 'lodash';

export default {
  mixins: [basicMixin],
  computed: {
    value: {
      get() {
        return _.get(this.model, this.path) || [];
      },
      set(val) {
        // 无值
        if (val === '') {
          this.removeValue(this.path);
        } else {
          this.setValue({ path: this.path, value: val });
        }
      },
    },
  },
};
</script>
