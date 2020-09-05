import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import classify from '../views/classify.vue'
import detail from '../views/detail.vue'
import read from '../views/read.vue'
const search = () => import("../views/search.vue")

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/index',
    name: 'Index',
    component: Index
  },
  {
    path: '/classify',
    name: 'classify',
    component: classify
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: detail
  },
  {
    path: '/read/:bookId/:id',
    name: 'read',
    component: read
  },
  {
    path: '/search',
    name: 'search',
    component: search
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
