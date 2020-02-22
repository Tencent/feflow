const state = {
  username: '',
  avatar: '',
  department: ''
};

const mutations = {
  SET_USER_INFO(state, payload) {
    state.username = payload.username;
    state.avatar = payload.avatar;
    state.department = payload.department;
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
