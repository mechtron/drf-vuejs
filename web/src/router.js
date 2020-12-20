import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './views/Home.vue'
import Posts from './views/Posts.vue'
import HOF from './views/HOF.vue'
import About from './views/About.vue'
import Auth from './components/Auth.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/posts',
    name: 'Posts',
    component: Posts
  },
  {
    path: '/hof',
    name: 'HOF',
    component: HOF
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/auth/:provider/:params',
    name: 'Auth',
    component: Auth
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
