import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../../pages/HomePage.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../../pages/SignupPage.vue'),
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../../pages/SigninPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
