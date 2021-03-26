import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
const Users = () => import(/* webpackChunkName: "users" */ '../components/users/Uers.vue')
const Audit = () => import(/* webpackChunkName: "audit_goods" */ '../components/goods/Audit.vue')
const Goods = () => import(/* webpackChunkName: "audit_goods" */ '../components/goods/Goods.vue')
const Orders = () => import(/* webpackChunkName: "orders" */ '../components/orders/Orders.vue')
const Sorts = () => import(/* webpackChunkName: "sorts" */ '../components/sorts/Sorts.vue')
const SwiperView = () => import(/* webpackChunkName: "swiper" */ '../components/indexDiy/SwiperView.vue')
const Admin = () => import(/* webpackChunkName: "admin" */ '../components/admin/Admin.vue')

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
      },
      {
        path: '/admin',
        component: Admin
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
