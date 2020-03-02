import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import apiAuthorize from '@/api/authorize';
// import FormCreate from '@form-create/element-ui'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ElementUI)
// Vue.use(FormCreate)
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false;

(async function () {
  // 获取当前服务器环境信息
  const userInfo = await apiAuthorize.getLoginUser();
  global.username = userInfo.EngName;
  global.avatar = `//r.hrc.oa.com/photo/150/${global.username}.png`;
  global.department = userInfo.DeptNameString;
  store.dispatch('UserInfo/SET_USER_INFO_ACTION', {
    username: global.username,
    avatar: global.avatar,
    department: global.department
  });

  // 获取用户配置
  const result = await apiAuthorize.checkAuth(userInfo);
  if (result && result.errcode === 0 && result.data) {
    store.dispatch('UserInfo/SET_ROLE_INFO_ACTION', {
      isAdmin: result.data.isAdmin,
      hasConfig: result.data.hasConfig,
      scaffold: result.data.scaffold,
      plugins: result.data.plugins
    });
  }
})();

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App />'
}).$mount('#app')
