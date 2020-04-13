import API from '../../api/market'

const state = {
  plugins: [],
  // {[key]: [value]}
  pluginsMap: {}
}

const mutations = {
  DECREMENT_MAIN_COUNTER(state) {
    state.main--
  },
  SET_PLUGIN(state, data) {
    state.plugins = data
  }
}

const actions = {
  getPlugins({ commit }) {
    API.getPluginListFromLego().then(({ data }) => {
      commit('SET_PLUGIN', data.plugin_list)
    })
    // do something async
  }
}

export default {
  state,
  mutations,
  actions
}
