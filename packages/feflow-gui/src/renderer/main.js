import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import apiAuthorize from '@/api/authorize'
// import FormCreate from '@form-create/element-ui'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ElementUI)
// Vue.use(FormCreate)
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false;

(async function () {
  // 获取当前服务器环境信息
  const userInfo = await apiAuthorize.getLoginUser()
  global.username = userInfo.EngName
  global.avatar = `//r.hrc.oa.com/photo/150/${global.username}.png`
})()

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
