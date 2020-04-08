import {
  loadGenerator,
  buildGeneratorConfig,
  checkBeforeRunGenerator,
  openDialogToGetDirectory,
  loadFeflowConfigFile
} from '../../bridge'
import { CREATE_CODE, DEFAULT_WORKSPACE } from '../../bridge/constants'
// Vuex 被放置在主进程中

const state = {
  // 脚手架列表
  list: [],
  configMap: {},
  currentGeneratorConfig: {},
  localConfigName: '',
  workSpace: DEFAULT_WORKSPACE,
  importWorkSpace: '',
  initCode: CREATE_CODE.INITIAL,
  projectListFromConfig: []
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
  SET_IMPORT_WORK_SPACE(state, workSpace) {
    state.importWorkSpace = workSpace
  },
  SET_PROJECT_INIT_STATE(state, { code }) {
    state.initCode = code
  },
  SET_PROJECT_LIST(state, projectList) {
    state.projectListFromConfig = projectList
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
  selectWorkSpace({ commit }) {
    openDialogToGetDirectory().then(files => {
      commit('SET_WORK_SPACE', files[0])
    })
  },
  importWorkSpace({ commit }) {
    openDialogToGetDirectory().then(files => {
      commit('SET_IMPORT_WORK_SPACE', files[0])
    })
  },
  resetState({ commit }) {
    commit('SET_PROJECT_INIT_STATE', { code: CREATE_CODE.INITIAL })
    commit('SET_IMPORT_WORK_SPACE', '')
    commit('SET_WORK_SPACE', DEFAULT_WORKSPACE)
  },
  checkBeforeRun(_, obj) {
    return new Promise(resolve => {
      const ret = checkBeforeRunGenerator(obj)
      resolve(ret)
    })
  },
  getProjectListFromConfig({ commit }) {
    const { projects = [] } = loadFeflowConfigFile()
    commit('SET_PROJECT_LIST', projects)
  }
}

export default {
  state,
  mutations,
  actions
}
