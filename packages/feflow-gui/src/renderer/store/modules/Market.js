import { getPluginListFromLego, getPluginInfoFromTnpm, formatPluginList } from '../../components/market/utils'
import { camelizeKeys } from 'humps'

const state = {
  // {"plugin-name": "description"}
  plugins: {},
  // {[key]: [value]}
  pluginsMap: {},
  pluginsInfoMap: {}
}

const mutations = {
  SET_PLUGIN_MAP(state, value) {
    state.pluginsInfoMap[value.name] = value
  },
  SET_PLUGIN(state, { pluginMap, pluginList }) {
    state.plugins = pluginList
    state.pluginsMap = pluginMap
  }
}

const actions = {
  getPlugins({ commit }) {
    getPluginListFromLego().then(({ data }) => {
      const { pluginList } = camelizeKeys(data.result)
      // TODO 获取用户本地已安装的插件
      const pluginMap = formatPluginList(pluginList)
      commit('SET_PLUGIN', { pluginMap, pluginList })
    })
  },
  getPluginInfo({ commit }, repo) {
    getPluginInfoFromTnpm(repo).then(resp => {
      console.log('resp', resp)
      commit('SET_PLUGIN_MAP', resp)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
