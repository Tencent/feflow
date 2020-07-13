import _ from 'lodash'
import extend from 'extend'
import { parseErrors } from '../util/util'
import Ajv from '../validate'
import localize from '../validate/localize'
import Generator from '../core/schema'

const ARRAY_ROOT_KEY = 'silentList'
const generator = new Generator()

const ajv = new Ajv()
let validator = null

export const init = ({ commit, state }, { schema, definition, model = {} }) => {
  const _state = {}
  const isSchemaValid = ajv.validateSchema(schema)
  // 根节点是array，要嵌套一层
  if (schema.type === 'array') {
    const newSchema = {
      title: '列表',
      type: 'object',
      properties: {},
      required: [ARRAY_ROOT_KEY],
    }

    newSchema.properties[ARRAY_ROOT_KEY] = Object.assign({}, schema)
    schema = newSchema

    if (!_.isEmpty(model)) {
      const newModel = {}

      newModel[ARRAY_ROOT_KEY] = model
      model = extend(true, {}, newModel)
    }

    if (!_.isEmpty(definition)) {
      const newForm = [
        {
          title: '',
          type: 'array',
          key: ARRAY_ROOT_KEY,
          items: [],
        },
      ]

      newForm[0].items = addRootArray(definition)
      definition = newForm
    }

    _state.isRootArray = true
  }

  if (Array.isArray(schema.propsOrder)) {
    const propsInOrder = {}
    schema.propsOrder.forEach((key) => {
      propsInOrder[key] = schema.properties[key]
    })
    schema.properties = propsInOrder
  }

  _state.definition = generator.parse(schema, definition)
  _state.switchProperties = generator.parseSwitchProperties(schema)
  _state.schema = schema
  _state.validator = null

  const data = generator.getDefaultModal(schema)

  _state.model = extend(true, {}, data, model)
  _state.messages = {}
  _state.valid = true
  _state.isSchemaValid = isSchemaValid

  commit('SET_STATE', _state)
}

/**
 * 设置表单元素校验结果
 * @param {Array} path   属性路径
 * @param {Number} status 0：初始状态，1：正确，2：错误
 * @param {String} msg    校验结果message
 */
export const setMessages = ({ commit, state }, messages) => {
  const map = {}

  Object.keys(messages).forEach(path => {
    const msg = messages[path]
    map[path] = msg.message
      ? {
          status: 2,
          message: messages[path].message,
        }
      : {
          status: 1,
        }
  })

  const errMsg = Object.assign({}, state.messages, map)

  commit('SET_SCHEMA_MESSAGE', errMsg)
}

// 校验整个表单
export const validate = ({ commit, state }, path) => {
  const _state = {}
  // 延迟compile，保证自定义format、keyword添加
  if (!validator) {
    validator = ajv.compile(state.schema)
  }

  const valid = validator(state.model)
  let errors
  path = path ? path.join('.') : null

  if (!valid) {
    localize(validator.errors, state.schema)
    const allErrors = parseErrors(validator.errors)

    if (path) {
      if (allErrors[path]) {
        errors = {}
        errors[path] = allErrors[path]
      }
    } else {
      errors = allErrors
    }

    if (errors) {
      setMessages({ commit, state }, errors)
    }
  }

  if (!errors && path) {
    errors = {}
    errors[path] = true
    setMessages({ commit, state }, errors)
  }

  _state.model = Object.assign({}, state.model)
  _state.valid = valid

  commit('SET_STATE', _state)
}

/**
 * 设置指定属性值，表单元素值修改时触发
 * @param {Array} path  属性路径
 * @param {ALL} value 值
 */
export const setValue = ({ commit, state }, { path, value }) => {
  const _state = {}
  if (!path || typeof value === 'undefined') {
    throw new Error('path and value is required!')
  }

  const last = path[path.length - 1]

  // 数组修改
  if (typeof last === 'number') {
    path.pop()

    const model = _.get(state.model, path)
    last >= model.length ? model.push(value) : model.splice(last, 1, value)
  } else {
    const model = _.cloneDeep(state.model)
    _.set(model, path, value)
    _state.model = Object.assign({}, model)
  }

  // 只有在严格模式下
  // 并且条件属性发生了变化才会更新definition
  if (state.schema.showType === 'strict' && state.switchProperties.includes(path[0])) {
    _state.definition = generator.parse(state.schema, [], _state.model)
  }

  validate({ commit, state: _.cloneDeep(Object.assign({}, state, _state)) }, path)

  commit('SET_STATE', _state)
}

export const setModel = ({ commit }, model) => {
  const _state = {}

  _state.model = _.cloneDeep(model)
  // validate(state)
  commit('SET_STATE', _state)
}

// 删除指定属性，表单元素值为空或数组删除时触发
export const removeValue = ({ commit, state }, path) => {
  const _state = {}

  const last = path[path.length - 1]

  if (typeof last === 'number') {
    path.pop()

    const model = _.get(state.model, path)

    if (model?.length) {
      model.splice(last, 1)
    }
  } else {
    const model = Object.assign({}, state.model)

    _.unset(model, path)
    _state.model = Object.assign({}, model)
  }

  // validate({ commit, state: _.cloneDeep(state) }, path)
  commit('SET_STATE', _state)
}

export const exchanceItem = ({ commit, state }, { path, newIndex, oldIndex }) => {
  const _state = {}

  if (newIndex > oldIndex) {
    const temp = newIndex
    newIndex = oldIndex
    oldIndex = temp
  }

  const model = [].concat(_.get(state.model, path))
  const oldItem = model.splice(oldIndex, 1)
  model.splice(newIndex, 0, oldItem[0])
  _state.model = model

  commit('SET_STATE', _state)
}

export const setOptions = ({ commit, state }, { key, options }) => {
  const _state = {}

  const definition = _.cloneDeep(state.definition)
  // TODO
  const def = getDefinitionByPath(definition, key)

  if (def) {
    def.options = options
    _state.definition = definition
    commit('SET_STATE', _state)
  }
}

function getDefinitionByPath(definition, path) {
  let def
  path = path.replace(/(\[\s?\])/g, '.$index')

  for (let i = 0, len = definition.length; i < len; i++) {
    def = definition[i]

    if (def.key && def.key.join('.') === path) {
      return def
    }

    if (def.items) {
      def = getDefinitionByPath(def.items, path)

      if (def) {
        return def
      }
    }
  }
}

function addRootArray(form) {
  _.forEach(form, (item, idx) => {
    item.key = ARRAY_ROOT_KEY + item.key

    if (item.items) {
      addRootArray(item.items)
    }
  })
}
