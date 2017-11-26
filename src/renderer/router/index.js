import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', name: 'connexion-form', component: require('@/components/pages/ConnexionForm') },
    { path: '/dashboard', name: 'dashboard', component: require('@/components/pages/Dashboard') },
    { path: '*', redirect: '/' }
  ]
})

export default router
