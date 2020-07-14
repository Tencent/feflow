<template>
  <el-select
    v-model="option"
    :disabled="definition.disabled"
    :placeholder="definition.placeholder"
    :multiple="config.multiple"
    :push-tags="config.pushTags"
    @change="handleChange"
  >
    <el-option
      v-for="option in definition.options"
      :key="option.value"
      :value="option.value"
      :disabled="isWorking"
    />
  </el-select>
</template>

<script>
import _ from 'lodash';
import extend from 'extend';
import basicMixin from '../mixins/basic.js';

const defaults = {
  maxHeight: '400px',
  searchable: true,
  multiple: false,
  taggable: false,
  pushTags: false,
  filterable: true,
  noDrop: false,
};

export default {
  mixins: [basicMixin],
  data() {
    return {
      option: _.get(this.model, this.path),
    };
  },
  computed: {
    config() {
      return extend(true, {}, defaults, this.definition.config);
    },
  },
  methods: {
    handleChange(value) {
      this.setValue({ path: this.path, value: value });
    },
  },
};
</script>
