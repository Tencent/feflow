import { loadGenerator, buildGeneratorConfig, runGenerator } from '../../bridge'

// Vuex 被放置在主进程中

const state = {
  list: [],
  configMap: {},
  count: 0,
  currentGeneratorConfig: {},
  localConfigName: ''
}

const mutations = {
  SET_GENERATOR_LIST(state, data) {
    const { list, configMap } = data
    state.list = list
    state.configMap = configMap
  },
  SET_LOCAL_CONFIG_NAME(state, localConfigName) {
    state.localConfigName = localConfigName
  }
}

const actions = {
  getGenerator({ commit }) {
    loadGenerator().then(res => {
      commit('SET_GENERATOR_LIST', res)
    })
  },
  builConfig({ commit }, config) {
    // 同步写
    const localConfigName = buildGeneratorConfig(config)
    commit('SET_LOCAL_CONFIG_NAME', localConfigName)
  },
  initGenerator({ state }, { execType, config }) {
    if (execType === 'path') {
      // 传入配置文件路径
      runGenerator({
        config: state.localConfigName
      })
    } else {
      // 配置传入
      runGenerator(config)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
