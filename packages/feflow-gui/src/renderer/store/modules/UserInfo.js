const state = {
  username: '',
  avatar: '',
  department: '',
  isAdmin: false,
  scaffold: '',
  plugins: '',
  hasConfig: false
};

const mutations = {
  SET_USER_INFO(state, payload) {
    state.username = payload.username;
    state.avatar = payload.avatar;
    state.department = payload.department;
  },

  SET_ROLE_INFO(state, payload) {
    state.isAdmin = payload.isAdmin;
    state.scaffold = payload.scaffold;
    state.plugins = payload.plugins;
    state.hasConfig = payload.hasConfig;
  }
}

// getters
const getters = {
  groupName: (state, getters) => {
    let department = state.department;
    department = department.split('/');
    department.pop();
    return department.join('/');
  }
}

const actions = {
  SET_USER_INFO_ACTION({ commit }, payload) {
    commit('SET_USER_INFO', payload);
  },
  SET_ROLE_INFO_ACTION({ commit }, payload) {
    commit('SET_ROLE_INFO', payload);
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
