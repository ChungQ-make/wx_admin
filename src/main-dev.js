import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
// 导入NProgress 的依赖包和css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 将axios挂载到vue原型对象上（全局调用）
Vue.prototype.$http = axios
// 配置请求根路径

// * 使用nginx反向代理后的api基址
// axios.defaults.baseURL = 'https://www.yycloud.ltd/api1'
// axios.defaults.baseURL = 'https://www.yycloud.ltd/api/api/private/v1'
// * 本地测试基址
axios.defaults.baseURL = 'http://localhost:5000/api/private/v1'

// 在 request 拦截器中 展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  // 添加拦截器  需要授权的 API ，必须在请求头vue中使用 `Authorization` 字段提供 `token` 令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在 response 拦截器中 隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.config.productionTip = false

// 原生的时间过滤器
Vue.filter('dateFormate', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
