import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { requireAuthGuard, guestOnlyGuard } from './guards'

//todo Implement logic in case the server does not respond in beforeEach Hook

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@pages/HomePage.vue'),
    beforeEnter: requireAuthGuard,
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@pages/SettingsPage.vue'),
    beforeEnter: requireAuthGuard,
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@pages/SignupPage.vue'),
    beforeEnter: guestOnlyGuard,
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('@pages/SigninPage.vue'),
    beforeEnter: guestOnlyGuard,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
