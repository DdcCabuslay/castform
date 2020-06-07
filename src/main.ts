import Vue from 'vue'
import App from './app.vue'
import './registerServiceWorker'
import store from './store'
import VueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.use(VueResource)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
