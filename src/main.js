import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import {Message} from 'element-ui'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
axios.interceptors.response.use(
  response => {
      const code = response.data.meta.status || 200 ;//若未设置默认成功状态
      switch (code) {
          case 200://为200执行该行
              return response;//成功直接返回
          case 201:
              return response;
          default://都不相同执行该行
              Message.error(response.data.meta.msg);
              return {data:false}
      }
  },
  error => {
      console.log("axios中response报错", error);
      Message({
          showClose: true,
          message: error.message,//弹出失败原因
          type: 'error'
      })
      return Promise.reject(error);
  }
)
Vue.prototype.$http=axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
