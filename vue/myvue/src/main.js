import Vue from 'vue'
import App from './App.vue'
import vueRes from 'vue-resource'
Vue.use(vueRes);
new Vue({
  el: '#app',
  render: h => h(App)
})
