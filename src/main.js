import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueCompositionApi from '@vue/composition-api'

import request from "../until/request"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
Vue.use(ElementUI)
Vue.prototype.$http = request;
Vue.use(request)

Vue.use(VueCompositionApi)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
