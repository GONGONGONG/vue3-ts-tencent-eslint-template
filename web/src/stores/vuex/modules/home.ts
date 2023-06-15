import type { Module } from 'vuex';
import { IRootState, IHomeSate } from '../stateType';
// import { getKeysMapForArray } from '@/common/util';
// import { ROLE_GROUP } from '@/common/components';
import { apiGetConfigActivity } from '@/api/modules/activity';
import { apiGetProjects } from '@/api/modules/project';
import { IActivityType, IProject } from '@/@types';
// import { resetProjectRow } from '@/common/resetFn';

const store: Module<IHomeSate, IRootState> = {
  namespaced: true,
  state: {
    activityType: [],
    activityTypeMap: {},
    activityTypeColorMap: {},
    projects: [],
    projectNameMap: {},
    roleGroup: [],
  },
  mutations: {
    CLEAR_ACTIVITY_CONDITION(state) {
      state.activityType = [];
      state.activityTypeMap = {};
      state.activityTypeColorMap = {};
      state.projects = [];
      state.projectNameMap = {};
    },
    UPDATE_STATE_ROLE_GROUP(state, list: string[]) {
      state.roleGroup = list;
    },
    UPDATE_STATE_ACTIVITY_TYPE(state, list: IActivityType[]) {
      state.activityType = list;
      // state.activityTypeMap = getKeysMapForArray(list);
      // state.activityTypeColorMap = getKeysMapForArray(list, 'id', 'activity_type_color');
    },
    UPDATE_STATE_PROJECTS(state, list: IProject[]) {
      state.projects = list;
      // state.projectNameMap = getKeysMapForArray(list, 'id');
    },
  },
  actions: {
    async ACTIONS_TYPE_LIST({ commit }) {
      let list = await apiGetConfigActivity();
      list = list.map(item => ({
        ...item,
        name: item.activity_name,
      }));
      commit('UPDATE_STATE_ACTIVITY_TYPE', list);
      return list;
    },
    async ACTIONS_PROJECTS({ commit }, params: T = {}, filterAble = false) {
      let list = await apiGetProjects(params);
      if (filterAble) {
        list = list.filter(item => !item.is_disabled);
      }
      // commit('UPDATE_STATE_PROJECTS', list.map(project => resetProjectRow(project)));
      return list;
    },
  },
};

export default store;
