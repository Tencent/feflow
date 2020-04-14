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
      const { pluginList: _pluginList } = camelizeKeys(data.result)
      // TODO 获取用户本地已安装的插件
      const { pluginMap, pluginList } = formatPluginList(_pluginList)
      commit('SET_PLUGIN', { pluginMap, pluginList })
    })
  },
  getPluginInfo({ commit }, repo) {
    getPluginInfoFromTnpm(repo)
      .then(resp => {
        commit('SET_PLUGIN_MAP', resp)
      })
      .catch(({ response }) => {
        const { data, status } = response
        if (status === 404) {
          commit('SET_PLUGIN_MAP', { key: '@tencent/' + repo, value: { status, data } })
        }
      })
  }
}

export default {
  state,
  mutations,
  actions
}
