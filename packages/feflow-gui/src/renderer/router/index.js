import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/admin',
      name: 'admin-page',
      component: require('@/components/admin').default
    },
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/create',
      name: 'create-page',
      component: require('@/components/create').default
    },
    {
      path: '/import',
      name: 'import-page',
      component: require('@/components/create/import').default
    },
    {
      path: '/project-service',
      name: 'project-service',
      component: require('@/components/project-service/ProjectIndex').default
    },
    {
      path: '/project-webview',
      name: 'project-webview',
      component: require('@/components/project-service/ProjectWebview').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
