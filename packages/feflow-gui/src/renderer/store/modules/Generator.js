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
    const localConfigName = buildGeneratorConfig(config)
    commit('SET_LOCAL_CONFIG_NAME', localConfigName)
  },
  loadGenerator({ state }) {
    runGenerator({
      config: state.localConfigName
    })
  }
}

export default {
  state,
  mutations,
  actions
}
