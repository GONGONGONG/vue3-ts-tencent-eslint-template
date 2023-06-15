import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import store, { storeKey } from '@/stores/vuex';
import bkUi from 'bkui-vue';
import { bkTooltips, clickoutside } from 'bkui-vue/lib/directives';
import path from 'path';
import fs from 'fs';

import App from './App.vue';
import router from './router';
import api from '@/api';

const app = createApp(App);

app.use(createPinia())
  .use(store, storeKey)
  .use(router)
  .use(bkUi);

app.directive('bk-tooltips', bkTooltips);
app.directive('bk-clickoutside', clickoutside);
//   app.directive('bk-ellipsis', ellipsis); // bkEllipsis
app.provide('$http', api);

if (process.env.NODE_ENV === 'development') {
  (app.config as any).devtools = true;
}

app.mount('#app');
