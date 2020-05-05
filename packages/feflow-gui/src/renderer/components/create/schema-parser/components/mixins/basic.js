import _ from 'lodash'
import { createNamespacedHelpers, mapState as mapStoreState } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('Schema')

export default {
  // data () {
  //   return {
  //     originValue: null
  //   }
  // },
  props: {
    definition: {
      type: Object,
      required: true
    },
    path: {
      type: Array,
      required: true
    },
    schema: {
      type: Object,
      required: true
    }
  },
  // created () {
  //   var value = _.get(this.model, this.path)

  //   if (typeof value !== 'undefined') {
  //     this.originValue = _.clone(value)
  //   } else if (this.originValue !== null) {
  //     // 设置表单元素默认值
  //     this.setValue({ path: this.path, value: this.originValue })
  //   }
  // },
  computed: {
    ...mapState({
      model: state => state.model
    }),
    ...mapStoreState({
      isWorking: state => state.Generator.isWorking
    }),
    value: {
      get() {
        return _.get(this.model, this.path)
      },
      set(val) {
        // 无值
        if (val === '') {
          this.removeValue(this.path)
        } else {
          this.setValue({ path: this.path, value: val })
        }
      }
    },
    name() {
      return this.path.join('.')
    },
    type() {
      return this.definition.type
    },
    required() {
      return this.definition.required
    },
    showType() {
      return this.$store.state.Schema.schema.showType
    }
  },
  methods: {
    ...mapActions(['setValue', 'removeValue'])
  }
}
