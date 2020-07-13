import { getPluginListFromLego, getPluginInfoFromTnpm, formatPluginList } from '../../components/market/utils'
import { loadLocalPluginAndGenerator } from '../../bridge'
import { camelizeKeys } from 'humps'

const state = {
  // {"plugin-name": "description"}
  plugins: {},
  // {[key]: [value]}
  pluginsMap: {},
  pluginsInfoMap: { isEmpty: true },
  localPlugins: [],
  // 记录插件任务状态
  taskMap: {},
}

const mutations = {
  SET_PLUGIN_MAP(state, value) {
    state.pluginsInfoMap = value
  },
  SET_PLUGIN_MAP_KEY(state, value) {
    state.pluginsInfoMap[value.name] = value
  },
  SET_PLUGIN(state, { pluginMap, pluginList }) {
    state.plugins = pluginList
    state.pluginsMap = pluginMap
  },
  SET_LOCAL_PLUGIN(state, pluginList) {
    state.localPlugins = pluginList
  },
  SET_TASK_MAP(state, taskMap) {
    state.taskMap = taskMap
  },
  SET_TASK_MAP_KEY(state, { key, value }) {
    state.taskMap[key] = value
  },
}

const actions = {
  getPlugins({ commit, state }) {
    getPluginListFromLego().then(({ data }) => {
      const { pluginList: _pluginList } = camelizeKeys(data.result)
      const initPluginsInfoMap = {}
      const initTaskMap = {}
      const { pluginMap, pluginList } = formatPluginList(_pluginList)

      commit('SET_PLUGIN', { pluginMap, pluginList })

      if (state.pluginsInfoMap.isEmpty) {
        // 及时更新
        pluginList.forEach(({ pkgName, key }) => {
          initPluginsInfoMap[pkgName] = {}
          initTaskMap[key] = false
        })
        commit('SET_PLUGIN_MAP', initPluginsInfoMap)
        commit('SET_TASK_MAP', initTaskMap)
      }
    })
  },
  getPluginInfo({ commit }, repo) {
    getPluginInfoFromTnpm(repo)
      .then(resp => {
        commit('SET_PLUGIN_MAP_KEY', resp)
      })
      .catch(err => {
        console.log('err', err)
        const { response } = err
        console.log('response', response)
        // TODO 上报点
        const { data, status } = response || {}
        if (status !== 200) {
          commit('SET_PLUGIN_MAP_KEY', { name: repo.split('/')[1], status, data })
        }
      })
  },
  getLocalPluginList({ commit }) {
    loadLocalPluginAndGenerator().then(plugin => {
      commit('SET_LOCAL_PLUGIN', plugin)
    })
  },
  setTaskMap({ commit }, obj) {
    commit('SET_TASK_MAP_KEY', obj)
  },
}

export default {
  state,
  mutations,
  actions,
}
