import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// Element ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import { directive as onClickOutside } from 'vue-on-click-outside'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(require('vue-moment'))

Vue.directive('on-click-outside', onClickOutside)

// Prototypes
Vue.prototype.$last = function (index, list) {
  return index === list.length - 1
}

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
