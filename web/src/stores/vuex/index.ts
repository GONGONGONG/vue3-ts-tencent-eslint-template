import type { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
// import { createStore, useStore as baseUseStore, createLogger, Store } from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

import home from './modules/home';
// import activity from './modules/activity';
import { apiGetUserInfo, type IAdmin } from '@/api/modules/user';
import type { IRootState, IHomeSate, IActivityState } from './stateType';

const aaa = 'aaaaa';

type StoreModules = {
  home: IHomeSate;
  activity: IActivityState;
};

const store = createStore<IRootState>({
  strict: true,
  modules: {
    home,
    activity,
  },
  state: {
    userName: '',
    userType: '',
    navList: [],
    windowHeight: 0,
  },
  getters: {
    isAdmin(state: T) {
      return state.userType === 'admin';
    },
    collectEnable(state) {
      return state.userName === window.omEnv.DEFAULT_ADMIN_USER;
    },
  },
  mutations: {
    UPDATE_NAV_LIST(state, list) {
      state.navList.splice(0, state.navList.length, ...list);
    },
    UPDATE_USER_INFO(state, info: IAdmin) {
      state.userName = info.username;
      state.userType = info.system_role;
      window.userName = info.username;
    },
    UPDATE_WINDOW_HEIGHT(state, height: number) {
      state.windowHeight = height;
    },
  },
  actions: {
    async GET_USER_INFO({ commit }) {
      const res = await apiGetUserInfo();
      commit('UPDATE_USER_INFO', res);
      return res;
    },
  },
  // plugins:
  //   process.env.NODE_ENV !== 'production'
  //     ? [
  //       createLogger(),
  //       createPersistedState({
  //         paths: ['home'],
  //       }),
  //     ]
  //     : [
  //       createPersistedState({
  //         paths: ['home'],
  //       }),
  //     ],
});

type StoreAll = Store<IRootState & StoreModules>;

export const storeKey: InjectionKey<StoreAll> = Symbol();
export function useStore(): StoreAll {
  return baseUseStore(storeKey);
}
export default store;
