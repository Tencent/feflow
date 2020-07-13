import * as mutations from './mutations';
import * as getters from './getters';
import * as actions from './actions';

const state = {
  schema: {},
  definition: [],
  model: {},
  theme: 'bootstrap',
  valid: true,
  messages: {}, // 校验信息
  ajv: null,
  validator: null,
  // exclude: [],  // 需要排除的校验字段
  isRootArray: false,
  // generator: new Generator()
  isSchemaValid: false, // 校验schema是否有效
  switchProperties: [], // 条件属性
};

export default {
  namespaced: true,
  state,
  actions: {
    ...actions,
  },
  mutations: {
    ...mutations,
  },
  getters: {
    ...getters,
  },
};
