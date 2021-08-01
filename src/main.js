import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//添加全局樣式
import './assets/css/global.css'
//引入iconfont
import './assets/font/iconfont.css'
//導入axios
import axios from "axios";

//挂載axios
Vue.prototype.$http = axios
axios.defaults.baseURL = "http://localhost:8181"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
