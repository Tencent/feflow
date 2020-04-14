import { getPluginListFromLego, getPluginInfoFromTnpm, formatPluginList } from '../../components/market/utils'
import { loadLocalPluginAndGenerator } from '../../bridge'
import { camelizeKeys } from 'humps'

const state = {
  // {"plugin-name": "description"}
  plugins: {},
  // {[key]: [value]}
  pluginsMap: {},
  pluginsInfoMap: {},
  localPlugins: []
}

const mutations = {
  SET_PLUGIN_MAP(state, value) {
    state.pluginsInfoMap[value.name] = value
  },
  SET_PLUGIN(state, { pluginMap, pluginList }) {
    state.plugins = pluginList
    state.pluginsMap = pluginMap
  },
  SET_LOCAL_PLUGIN(state, pluginList) {
    state.localPlugins = pluginList
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
        console.log('resp', resp)
        commit('SET_PLUGIN_MAP', resp)
      })
      .catch(err => {
        console.log('err', err)
        const { response } = err
        // TODO 上报点
        const { data, status } = response || {}
        if (status !== 200) {
          commit('SET_PLUGIN_MAP', { key: '@tencent/' + repo, value: { status, data } })
        }
      })
  },
  getLocalPluginList({ commit }) {
    loadLocalPluginAndGenerator().then(plugin => {
      console.log('loadLocalPluginAndGenerator', plugin)
      commit('SET_LOCAL_PLUGIN', plugin)
    })
  },
  handleInstall({ commit }, fullPkgPath) {
    console.log('fullPkgPath', fullPkgPath)
  }
}

export default {
  state,
  mutations,
  actions
}
