import { getPluginListFromLego, getPluginInfoFromTnpm } from '../../components/market/utils'
import { camelizeKeys } from 'humps'

const state = {
  // {"plugin-name": "description"}
  plugins: [],
  // {[key]: [value]}
  pluginsMap: {}
}

const mutations = {
  SET_PLUGIN_MAP(state, value) {
    state.pluginsMap[value.name] = value
  },
  SET_PLUGIN(state, data) {
    state.plugins = data
  }
}

const actions = {
  getPlugins({ commit }) {
    getPluginListFromLego().then(({ data }) => {
      const { pluginList } = camelizeKeys(data.result)
      commit('SET_PLUGIN', pluginList)
    })
  },
  getPluginInfo({ commit }, repo) {
    getPluginInfoFromTnpm(repo).then(resp => {
      commit('SET_PLUGIN_MAP', resp)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
