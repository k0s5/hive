import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from 'vue-router'
import { useRefreshAuthTokens } from '@/features/auth/refresh/model'
import useUserStore from '@entities/user/model/store'

const requireAuthGuard = async (
  _: RouteLocationNormalized,
  __: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore()
  const { refreshAuthTokens } = useRefreshAuthTokens()

  if (!userStore.user) {
    if (localStorage.getItem('refreshToken')) {
      await refreshAuthTokens()
      if (!userStore.user) {
        return next({ name: 'signin' })
      }
      next()
    } else {
      next({ name: 'signin' })
    }
  }
  next()
}

const isAuthorizedGuard = async (
  _: RouteLocationNormalized,
  __: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore()
  // const { refreshAuthTokens } = useRefreshAuthTokens()
  // await refreshAuthTokens()
  if (userStore.user) {
    next({ name: 'home' })
  } else {
    next()
  }
}

const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../../pages/HomePage.vue'),
    beforeEnter: requireAuthGuard,
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../../pages/SignupPage.vue'),
    beforeEnter: isAuthorizedGuard,
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('../../pages/SigninPage.vue'),
    beforeEnter: isAuthorizedGuard,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
