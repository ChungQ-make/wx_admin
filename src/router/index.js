import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Uers.vue'
import Audit from '../components/goods/Audit.vue'
import Goods from '../components/goods/Goods.vue'
import Orders from '../components/orders/Orders.vue'
import Sorts from '../components/sorts/Sorts.vue'
import SwiperView from '../components/indexDiy/SwiperView.vue'
Vue.use(VueRouter)

const routes = [
  // 设置重定向
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/audit',
        component: Audit
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/sorts',
        component: Sorts
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/swiper',
        component: SwiperView
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 为路由对象 挂载beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数 表示放行
  // next() 放行  next('/login') 强制跳转
  // return之后if后面的代码都不会执行
  if (to.path === '/login') return next()
  // 根据token值 觉决定是否放行
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
