import { loadGenerator, buildGeneratorConfig, runGenerator, saveGeneratorConfig } from '../../bridge'
import { dialog } from 'electron'
import { CREATE_CODE } from '../../bridge/constants'
// Vuex 被放置在主进程中

const state = {
  list: [],
  configMap: {},
  count: 0,
  currentGeneratorConfig: {},
  localConfigName: '',
  workSpace: '~/.fef/workspace',
  initCode: CREATE_CODE.INITIAL
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
  SET_PROJECT_INIT_STATE(state, { sequenceId = '', code }) {
    state.successProjectId = sequenceId
    state.initCode = code
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
  initGenerator({ state, commit }, { execType, config, sequenceId, generator }) {
    const opt = {}
    const { workSpace } = state
    if (execType === 'path') {
      // 传入配置文件路径
      opt.param = state.localConfigName
    } else {
      // 配置传入
      opt.param = config
    }
    opt.generator = generator

    runGenerator(opt, workSpace).then(code => {
      if (code === CREATE_CODE.SUCCESS) {
        // 项目成功初始化
        commit('SET_PROJECT_INIT_STATE', { sequenceId, code })
        // 写入项目配置
        saveGeneratorConfig(config.name, workSpace + '/' + config.name)
      } else {
        // 其他失败情况
        commit('SET_PROJECT_INIT_STATE', { code, sequenceId: '' })
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
  },
  resetState({ commit }) {
    commit('SET_PROJECT_INIT_STATE', { code: CREATE_CODE.INITIAL, sequenceId: '' })
  }
}

export default {
  state,
  mutations,
  actions
}
