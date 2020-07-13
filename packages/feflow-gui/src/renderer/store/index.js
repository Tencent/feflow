import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState, createSharedMutations } from 'vuex-electron';
import createPromiseAction from './plugin/promise';

import modules from './modules';

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState({
      whitelist: [],
    }),
    createSharedMutations(),
    createPromiseAction(),
  ],
  // plugins: [createSharedMutations(), createPromiseAction()],
  strict: process.env.NODE_ENV !== 'production',
});
