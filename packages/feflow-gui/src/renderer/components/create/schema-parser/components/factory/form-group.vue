<template>
  <div
    class="form-group"
    :class="[name, valid.status === 1 ? 'has-success' : valid.status === 2 ? 'has-error' : '']"
    v-if="definition"
  >
    <el-form-item :label="definition.title" v-if="definition.title">
      <!-- <label class="col-sm-2 control-label">
        <span v-if="definition.required" class="required">*</span>
        {{ definition.title }}:
      </label>-->
      <div>
        <component :is="definition.type" :definition="definition" :path="path" :schema="schema"></component>
      </div>
      <div class="form-tips">
        <span v-show="valid.status !== 2">{{description}}</span>
        <span v-show="valid.status === 2">{{valid.message}}</span>
      </div>
    </el-form-item>
    <!-- <el-form-item v-else>
      <div>
        <component :is="definition.type" :definition="definition" :path="path" :schema="schema"></component>
      </div>
      <div class="form-tips">
        <span v-show="valid.status !== 2">{{ description }}</span>
        <span v-show="valid.status === 2">{{ valid.message }}</span>
      </div>
    </el-form-item>-->
  </div>
</template>

<script>
import _ from 'lodash'
// import objectpath from 'objectpath'
import { createNamespacedHelpers } from 'vuex'
import vText from '../basic/text.vue'
import Checkbox from '../basic/checkbox.vue'
import Checkboxes from '../basic/checkboxes.vue'
import vDate from '../basic/date.vue'
import Hidden from '../basic/hidden.vue'
import vHtml from '../basic/html.vue'
import vNumber from '../basic/number.vue'
import vSelect from '../basic/select.vue'
import vTextArea from '../basic/textarea.vue'
// import Editor from '../basic/editor.vue'
// import ImageUpload from '../basic/image-upload.vue'

const { mapState, mapGetters } = createNamespacedHelpers('Schema')

const DEFAULT_VALID = {
  status: 0,
  message: ''
}

export default {
  props: {
    definition: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: -1
    }
  },
  computed: {
    ...mapState({
      messages: state => state.messages
    }),
    ...mapGetters(['getSchema']),
    valid() {
      return _.get(this.messages, this.path.join('.')) || DEFAULT_VALID
    },
    description() {
      return this.definition.description
    },
    path() {
      // 根据实际坐标设置路径
      let key = this.definition.key

      if (key) {
        key = key.slice()

        // 先替换父级的path,取父级路径
        var parentPath = this.$parent.$parent.path

        if (parentPath) {
          var len = parentPath.length
          var keyLen = key.length

          if (len < keyLen) {
            key.splice(0, len)
            key = parentPath.slice(0, len).concat(key)
          }
        }

        let idx = this.index
        // TODO: 这个传递index的方式有点牵强。
        idx = idx !== -1 ? idx : this.$parent.$parent.index

        if (idx !== -1) {
          var i = _.lastIndexOf(key, '$index')

          if (i > -1) {
            key.splice(i, 1, idx)
          }
        }

        return key
      } else {
        // 没有key就继承父级的path，保证往上层找肯定能找到path
        return this.$parent.$parent.path || []
      }
    },
    name() {
      return this.path.join('-')
    },
    schema() {
      return this.getSchema(this.definition.key)
    }
  },
  components: {
    'v-text': vText,
    checkbox: Checkbox,
    checkboxes: Checkboxes,
    date: vDate,
    hidden: Hidden,
    'v-html': vHtml,
    number: vNumber,
    'v-select': vSelect,
    'v-textarea': vTextArea
    // editor: Editor,
    // 'image-upload': ImageUpload
  }
}
</script>
<style scoped lang="less">
.form-tips {
  color: red;
}
</style>