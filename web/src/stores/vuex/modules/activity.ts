import http from '@/api';
import { Module } from 'vuex';
import type { IRootState, IActivityState } from '../stateType';

const store: Module<IActivityState, IRootState> = {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    getActivities(ctx, params) {
      return http.get('/api/v1/activities/', params).catch(() => []);
    },
    createActivity(ctx, params) {
      return http.post('/api/v1/activities/', params).catch(() => []);
    },
  },
};

export default store;
