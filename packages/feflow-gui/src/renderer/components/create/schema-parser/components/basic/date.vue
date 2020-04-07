<template>
  <el-date-picker
    v-model="value"
    :type="config.type"
    :placeholder="definition.placeholder"
  ></el-date-picker>
</template>

<script>
import Datepicker from 'vue2-datepicker'
import extend from 'extend'
import basicMixin from '../mixins/basic.js'

const defaults = {
  type: 'date',
  range: false,
  format: 'YYYY-MM-DD',
  valueType: 'format',
  lang: 'zh',
  clearable: false,
  confirm: false,
  editable: true,
  disabled: false,
  appendToBody: false,
  width: 210,
  notBefore: '',
  notAfter: '',
  disabledDays: null
}

export default {
  computed: {
    format() {
      var date = this.definition.config

      if (date && date.format) {
        return date.format
      }

      const dateFormat = this.schema.format || ''
      let format

      switch (dateFormat) {
        case 'date':
          format = 'YYYY-MM-DD'
          break
        case 'time':
          format = 'HH:mm:ss'
          break
        case 'date-time':
        default:
          format = 'YYYY-MM-DD HH:mm:ss'
          break
      }

      return format
    },
    config() {
      return extend(true, {}, defaults, this.definition.config)
    }
  },
  components: {
    Datepicker
  },
  mixins: [basicMixin]
}
</script>
