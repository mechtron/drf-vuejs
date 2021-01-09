import '@babel/polyfill'
import 'mutationobserver-shim'
import axios from "axios"
import Vue from 'vue'
import './plugins/axios'
import './plugins/bootstrap-vue'
import infiniteScroll from 'vue-infinite-scroll'

import App from './App.vue'
import router from './router'
import store from './store'


const getRuntimeConfig = async () => {
  const runtimeConfig = await fetch('/config.json')
  return await runtimeConfig.json()
}

getRuntimeConfig().then(function(json) {
  Vue.config.productionTip = false
  axios.defaults.baseURL = json.API_HOSTNAME
  Vue.use(infiniteScroll)
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
});
