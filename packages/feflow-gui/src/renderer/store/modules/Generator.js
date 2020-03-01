import { loadGenerator, buildGeneratorConfig, runGenerator } from '../../bridge'
import { dialog } from 'electron'

// Vuex 被放置在主进程中

const state = {
  list: [],
  configMap: {},
  count: 0,
  currentGeneratorConfig: {},
  localConfigName: '',
  workSpace: ''
}

const mutations = {
  SET_GENERATOR_LIST(state, data) {
    const { list, configMap } = data
    state.list = list
    state.configMap = configMap
  },
  SET_LOCAL_CONFIG_NAME(state, localConfigName) {
    state.localConfigName = localConfigName
  },
  SET_WORK_SPACE(state, workSpace) {
    state.workSpace = workSpace
  },
  SET_PROJECT_INIT_STATE(state, id) {
    state.successProjectId = id
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
  initGenerator({ state, commit }, { execType, config, sequenceId }) {
    let params = {}
    if (execType === 'path') {
      // 传入配置文件路径
      params = {
        config: state.localConfigName
      }
    } else {
      // 配置传入
      params = Object.assign({}, config, {
        simple: true
      })
    }

    runGenerator(params, state.workSpace).then(code => {
      if (code === 0) {
        commit('SET_PROJECT_INIT_STATE', sequenceId)
      }
    })
  },
  selectWorkSpace({ commit }) {
    dialog.showOpenDialog(
      {
        properties: ['openFile', 'openDirectory']
      },
      function(files) {
        commit('SET_WORK_SPACE', files[0])
      }
    )
  }
}

export default {
  state,
  mutations,
  actions
}
