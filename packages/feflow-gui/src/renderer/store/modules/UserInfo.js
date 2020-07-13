const state = {
  username: '',
  avatar: '',
  department: '',
  isAdmin: false,
  scaffold: '',
  plugins: '',
  hasConfig: false,
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
  },
}

// getters
const getters = {
  groupName: (state, getters) => {
    let { department } = state;
    department = department.split('/');
    department.pop();
    return department.join('/');
  },
  scaffold: (state) => {
    let { scaffold } = state;

    try {
      scaffold = JSON.parse(scaffold);
      if (scaffold) {
        return scaffold.join(';');
      }
    } catch (e) { }
  },
  plugins: (state) => {
    let { plugins } = state;

    try {
      plugins = JSON.parse(plugins);
      if (plugins) {
        return plugins.join(';');
      }
    } catch (e) { }
  },
}

const actions = {
  SET_USER_INFO_ACTION({ commit }, payload) {
    commit('SET_USER_INFO', payload);
  },
  SET_ROLE_INFO_ACTION({ commit }, payload) {
    commit('SET_ROLE_INFO', payload);
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
